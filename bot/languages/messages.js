const { DELAULT_LANG } = require('../constants');

const MESSAGES = {
  getSubscribeSettingsMessage: {
    ru: 'Выберите тип записей для подписки:',
    'en-US': 'Select subscribed posts type:',
  },
  getSaveSubscribesMessage: {
    ru: 'Настройки подписок были сохранены!',
    'en-US': 'Subscribe settings were saved!',
  },
  getUnsubscribeMessage: {
    ru: 'Вы были отписаны от новостей!',
    'en-US': 'You were unsubscribed from the news!',
  },
  getSubscribeMessage: {
    ru: 'Вы были подписаны на рассылку новостей!',
    'en-US': 'You were subscribed to the news!',
  },
  getPlaceholderMessage: {
    ru: 'В разработке: https://github.com/ifedyukin/webpurple-tg-bot/projects',
    'en-US': 'In Development: https://github.com/ifedyukin/webpurple-tg-bot/projects',
  },
  getProfileMessage: {
    ru: 'Наши профили:',
    'en-US': 'Our profiles:',
  },
  getProjectsMessage: {
    ru: 'Наши проекты:',
    'en-US': 'Our projects:',
  },
  getAboutText: {
    ru: `Рязанское сообщество веб-разработчиков и веб-дизайнеров, целями которого являются: 
    * популяризация веб-технологий и подходов к веб-разработке;
    * обмен знаниями;
    * активное участие и поддержка open-source сообщества; 
    * влияние на развитие веб-стандартов и веба в целом.`,
    'en-US': 'WebPurple is the Ryazan FrontEnd community',
  },
  getNoEventsMessage: {
    ru: 'Запланированных мероприятий нет!',
    'en-US': 'No future events!',
  },
};

module.exports = Object.entries(MESSAGES)
  .reduce((acc, [name, labels]) => ({
    ...acc,
    [name]: lang => labels[lang] || labels[DELAULT_LANG],
  }), {
    getSubscribeTypeMessage: (lang, isSubscribe, match) => {
      switch (lang) {
        case 'ru':
          return `Вы были ${isSubscribe ? 'подписаны на' : 'отписаны'} от категории "${match[1]}"`;
        case 'en-US':
        default:
          return `You were ${isSubscribe ? 'subscribed to' : 'unsubscribed from'} "${match[1]}" posts`;
      }
    },
  });
