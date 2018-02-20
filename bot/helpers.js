const fetch = require('node-fetch');
const userModel = require('../models/user');
const messageModel = require('../models/message');
const { keenOnAddToChat } = require('./analytics');
const { notifyUserId, botToken } = require('../config');
const { POST_TYPES, VK_REQUESTS } = require('./constants');
const { getCommandByLang } = require('./languages/commands');
const {
  vkSecret,
  vkResponse,
  vkCommunity,
  vkCommunityId,
} = require('../config');
const { getNoEventsMessage, getNoNewsMessage } = require('./languages/messages');
const {
  getLayout,
  vkPostProcess,
  buttonsLabels,
  vkEventProcess,
} = require('./utils');

const getMenuKeyboard = (isSubscribe, lang) => {
  const makeKey = getCommandByLang(lang);
  const labels = buttonsLabels(isSubscribe);

  return getLayout(lang)
    .map(count => labels
      .splice(0, count)
      .filter(f => f)
      .map(makeKey));
};

const changeUserSubscribe = (uid, lang, callback, subscribe = false) => {
  if (subscribe === null) {
    userModel.findOne({ uid }).exec()
      .then(user => callback(getMenuKeyboard(user.subscribe, lang)))
      .catch(console.log);
  } else {
    userModel.findOne({ uid }).exec()
      .then((user) => {
        if (!user) {
          const subscribes = POST_TYPES.reduce((acc, type) => {
            acc[type] = true;
            return acc;
          }, {});
          userModel.create({ uid, subscribe, subscribes })
            .then(() => callback(getMenuKeyboard(subscribe, lang)));
        } else {
          userModel.findOneAndUpdate({ uid }, { ...user.toObject(), subscribe }).exec()
            .then(() => callback(getMenuKeyboard(subscribe, lang)));
        }
      })
      .catch(console.log);
  }
};

const getTypesKeyboard = (config, lang) => Object.keys(config)
  .filter(type => POST_TYPES.includes(type.toLowerCase()))
  .map(key => `${config[key] ? '✅' : '❌'} ${key.charAt(0).toUpperCase() + key.slice(1)}`)
  .reduce((acc, item, index) => {
    if (index % 2) acc[acc.length - 1].push(item);
    else acc.push([item]);
    return acc;
  }, [])
  .concat([[getCommandByLang(lang)('saveSettings')]]);

const onGetNews = (bot, uid, lang) => {
  fetch(VK_REQUESTS.getWall)
    .then(r => r.json())
    .then((r) => {
      if (r.response && r.response.items) {
        r.response.items.reduce(
          // chaining bot responses via promise
          (promise, post) => promise.then(
            () => bot.sendMessage(uid, vkPostProcess(post).text, { parse_mode: 'HTML' }),
            console.log,
          ),
          Promise.resolve(),
        );
      } else {
        bot.sendMessage(uid, getNoNewsMessage(lang));
      }
    });
};

const onGetEvents = (bot, uid, lang) => {
  fetch('https://vk.com/al_groups.php', {
    method: 'POST',
    body: `act=show_events&al=1&oid=-${vkCommunityId}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then(res => res.text())
    .then(string => string
      .match(/public_event_cell(\d+)/ig)
      .map(s => s.replace(/public_event_cell(\d+)/ig, '$1')))
    .then((groups) => {
      fetch(VK_REQUESTS.getGroups(groups.slice(0, 5)))
        .then(res => res.json())
        .then((res) => {
          if (res.response && res.response.length) {
            const nowDate = new Date();
            const processEvent = vkEventProcess(uid, bot);
            const events = res.response
              .filter(event => new Date(event.start_date * 1000) > nowDate)
              .sort((a, b) => a.start_date - b.start_date);

            if (!events.length) {
              bot.sendMessage(uid, getNoEventsMessage(lang));
              return;
            }

            events.reduce(
              // chaining bot responses via promise
              (promise, event) => promise.then(
                () => processEvent(event),
                console.log,
              ),
              Promise.resolve(),
            );
          }
        });
    });
};

const onVkPost = (bot) => {
  const regExp = new RegExp(`#(${POST_TYPES.join('|')})@${vkCommunity}`, 'gi');

  return (req, res) => {
    const { secret, object } = req.body;
    if (vkResponse !== 'ok') {
      res.send(vkResponse);
      return;
    }

    if (secret === vkSecret) {
      const { text, types } = vkPostProcess(object, regExp);
      const query = { subscribe: true };
      if (types.length) {
        query.$or = types.map(type => ({ [`subscribes.${type}`]: true }));
      } else {
        query[`subscribes.${POST_TYPES[0]}`] = true;
      }
      userModel.find(query).exec()
        .then((subscribers = []) => subscribers
          .filter(subscriber => subscriber.subscribe)
          .forEach(({ uid }) => {
            bot.sendMessage(uid, text, {
              parse_mode: 'HTML',
            });
          }))
        .catch(console.log);
      res.send('ok');
    } else {
      res.sendStatus(403);
    }
  };
};

const subscribeNotPrivate = (info, msg) => {
  if (info.id === msg.new_chat_participant.id) {
    userModel.findOne({ uid: msg.chat.id }).exec()
      .then((chat) => {
        const subscribes = POST_TYPES.reduce((acc, type) => {
          acc[type] = true;
          return acc;
        }, {});
        keenOnAddToChat({ chat: msg.chat.id });
        if (!chat) {
          userModel.create({ uid: msg.chat.id, subscribe: true, subscribes });
        } else {
          userModel.findOneAndUpdate({ uid: msg.chat.id }, { ...chat.toObject(), subscribe: true, subscribes }).exec();
        }
      })
      .catch(console.log);
  }
};

const onNewsletter = (adminId, bot, text) => userModel.findOne({ uid: adminId }).exec()
  .then(user => (user.admin ? userModel.find({}).exec() : Promise.resolve()))
  .then((subscribers = []) => subscribers
    .forEach(({ uid }) => {
      bot.sendMessage(uid, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
        .then(res => messageModel.create({ text: res.text, message_id: res.message_id, chat_id: res.chat.id }));
    }))
  .catch(console.log);

const onDeleteMessage = (adminId, bot, messageId) => userModel.findOne({ uid: adminId }).exec()
  .then((user) => {
    if (user.admin) {
      return messageModel.findOne({ message_id: messageId }).exec()
        .then(message => bot.deleteMessage(message.chat_id, messageId))
        .then(r => r && messageModel.findOneAndRemove({ message_id: messageId }).exec())
        .then(() => bot.sendMessage(adminId, 'Delete success!'));
    }
    return Promise.resolve();
  })
  .catch(console.log);

const uncaughtExceptionHandler = (error) => {
  const message = `
  WebPurple bot exception!
  Code: ${error.code}
  Message: ${error.message}
  `;
  const params = `chat_id=${notifyUserId}&disable_web_page_preview=1&text=${message}`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?${params}`);
};

module.exports = {
  onVkPost,
  onGetNews,
  onGetEvents,
  onNewsletter,
  onDeleteMessage,
  getTypesKeyboard,
  changeUserSubscribe,
  subscribeNotPrivate,
  uncaughtExceptionHandler,
};
