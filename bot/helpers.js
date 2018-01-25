const fetch = require('node-fetch');
const userModel = require('../models/user');
const { keenOnAddToChat } = require('./analytics');
const { POST_TYPES, VK_REQUESTS } = require('./constants');
const { getCommandByLang } = require('./languages/commands');
const { vkCommunity, vkSecret, vkResponse } = require('../config');
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
      .catch(e => console.log(e));
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
      .catch(e => console.log(e));
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
            err => console.log(err),
          ),
          Promise.resolve(),
        );
      } else {
        bot.sendMessage(uid, getNoNewsMessage(lang));
      }
    });
};

const onGetEvents = (bot, uid, lang) => {
  fetch(VK_REQUESTS.eventsSearch)
    .then(r => r.json())
    .then((r) => {
      if (r.response && r.response.items && r.response.items.length) {
        const groups = r.response.items.map(g => g.id);
        fetch(VK_REQUESTS.getGroups(groups))
          .then(res => res.json())
          .then((res) => {
            if (res.response && res.response.length) {
              const processEvent = vkEventProcess(uid, bot);
              res.response
                .sort((a, b) => a.start_date - b.start_date)
                .reduce(
                  // chaining bot responses via promise
                  (promise, event) => promise.then(
                    () => processEvent(event),
                    err => console.log(err),
                  ),
                  Promise.resolve(),
                );
            }
          });
      } else {
        bot.sendMessage(uid, getNoEventsMessage(lang));
      }
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
        .catch(e => console.log(e));
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
        if (!chat) userModel.create({ uid: msg.chat.id, subscribe: true, subscribes });
        else userModel.findOneAndUpdate({ uid: msg.chat.id }, { ...chat.toObject(), subscribe: true, subscribes }).exec();
      })
      .catch(e => console.log(e));
  }
};

module.exports = {
  onVkPost,
  onGetNews,
  onGetEvents,
  getTypesKeyboard,
  changeUserSubscribe,
  subscribeNotPrivate,
};
