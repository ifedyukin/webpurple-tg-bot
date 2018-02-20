
const userModel = require('../models/user');
const TelegramBot = require('node-telegram-bot-api');
const { botToken, isProduction } = require('../config');
const { expressions } = require('./languages/commands');
const { getProfilesByLang, getProjectsByLang } = require('./languages/links');
const { isSupportType, toggleSubscribe, isTypeSubscribed } = require('./utils');
const {
  onGetNews,
  onGetEvents,
  onNewsletter,
  onDeleteMessage,
  getTypesKeyboard,
  changeUserSubscribe,
} = require('./helpers');
const {
  keenOnStart,
  keenOnSubscribe,
  keenOnUnsubscribe,
  keenOnChangeSubscribe,
} = require('./analytics');
const {
  getAboutText,
  getProfileMessage,
  getProjectsMessage,
  getSubscribeMessage,
  getUnsubscribeMessage,
  getSubscribeTypeMessage,
  getSaveSubscribesMessage,
  getSubscribeSettingsMessage,
} = require('./languages/messages');

const botUrl = `/bot${botToken}`;
const bot = new TelegramBot(botToken, {
  onlyFirstMatch: true,
  polling: !isProduction,
});

bot.onText(expressions.start, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  keenOnStart({ uid });
  changeUserSubscribe(
    uid,
    lang,
    keyboard => bot.sendMessage(
      uid,
      getAboutText(lang),
      { reply_markup: { resize_keyboard: true, keyboard } },
    ),
  );
});

bot.onText(expressions.contribute, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  bot.sendMessage(uid, getProjectsMessage(lang), {
    reply_markup: { inline_keyboard: getProjectsByLang(lang) },
  });
});

bot.onText(expressions.community, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  bot.sendMessage(uid, getProfileMessage(lang), {
    reply_markup: { inline_keyboard: getProfilesByLang(lang) },
  });
});

bot.onText(expressions.lastNews, msg => onGetNews(bot, msg.chat.id, msg.from.language_code));

bot.onText(expressions.nextEvent, msg => onGetEvents(bot, msg.chat.id, msg.from.language_code));

bot.onText(expressions.subscribe, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  keenOnSubscribe({ uid });
  changeUserSubscribe(
    uid,
    lang,
    keyboard => bot.sendMessage(
      uid,
      getSubscribeMessage(lang),
      { reply_markup: { resize_keyboard: true, keyboard } },
    ),
    true,
  );
});

bot.onText(expressions.unsubscribe, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  keenOnUnsubscribe({ uid });
  changeUserSubscribe(
    uid,
    lang,
    keyboard => bot.sendMessage(
      uid,
      getUnsubscribeMessage(lang),
      { reply_markup: { resize_keyboard: true, keyboard } },
    ),
    false,
  );
});

bot.onText(expressions.settings, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  userModel.findOne({ uid }).exec()
    .then((user) => {
      if (user) {
        bot.sendMessage(uid, getSubscribeSettingsMessage(lang), {
          reply_markup: {
            resize_keyboard: true,
            keyboard: getTypesKeyboard(user.subscribes, lang),
          },
        });
      }
    })
    .catch(console.log);
});

bot.onText(/[❌|✅] (.+)/i, (msg, match) => {
  if (isSupportType(match)) {
    const { chat: { id: uid }, text, from: { language_code: lang } } = msg;
    const isSubscribe = !isTypeSubscribed(text);
    keenOnChangeSubscribe({ category: match[1], isSubscribe });
    userModel.findOne({ uid }).exec()
      .then((user) => {
        if (user) {
          const newUser = toggleSubscribe(match, user.toObject(), isSubscribe);
          userModel.findOneAndUpdate({ uid }, newUser).exec()
            .then(() => {
              bot.sendMessage(
                uid,
                getSubscribeTypeMessage(lang, isSubscribe, match),
                {
                  reply_markup: {
                    resize_keyboard: true,
                    keyboard: getTypesKeyboard(newUser.subscribes, lang),
                  },
                },
              );
            });
        }
      })
      .catch(console.log);
  }
});

bot.onText(expressions.saveSettings, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  changeUserSubscribe(
    uid,
    lang,
    keyboard => bot.sendMessage(
      uid,
      getSaveSubscribesMessage(lang),
      { reply_markup: { resize_keyboard: true, keyboard } },
    ),
    null,
  );
});

bot.onText(expressions.sendMessage, (msg, match) => {
  const { chat: { id: uid } } = msg;
  const text = match[1];
  onNewsletter(uid, bot, text);
});

bot.onText(expressions.deleteMessage, (msg, match) => {
  const { chat: { id: uid } } = msg;
  const messageId = match[1];
  onDeleteMessage(uid, bot, messageId);
});

bot.onText(expressions.all, (msg) => {
  const { chat: { id: uid }, from: { language_code: lang } } = msg;
  changeUserSubscribe(
    uid,
    lang,
    keyboard => bot.sendMessage(
      uid,
      getAboutText(lang),
      { reply_markup: { resize_keyboard: true, keyboard } },
    ),
    null,
  );
});

module.exports = {
  bot,
  botUrl,
};
