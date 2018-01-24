const { DELAULT_LANG } = require('../constants');

const COMMANDS = {
  start: {
    langs: {
      'en-US': '/start',
    },
  },
  contribute: {
    emoji: '♥️',
    langs: {
      ru: 'Сделать вклад',
      'en-US': 'Contribute',
    },
  },
  community: {
    emoji: '🤝',
    langs: {
      ru: 'Сообщество',
      'en-US': 'Community',
    },
  },
  lastNews: {
    emoji: '📝',
    langs: {
      ru: 'Последние новости',
      'en-US': 'Last news',
    },
  },
  nextEvent: {
    emoji: '📆',
    langs: {
      ru: 'Следующее событие',
      'en-US': 'Next event',
    },
  },
  subscribe: {
    emoji: '🔔',
    langs: {
      ru: 'Подписаться',
      'en-US': 'Subscribe',
    },
  },
  unsubscribe: {
    emoji: '🔕',
    langs: {
      ru: 'Отписаться',
      'en-US': 'Unsubscribe',
    },
  },
  settings: {
    emoji: '⚙️',
    langs: {
      ru: 'Настройки',
      'en-US': 'Settings',
    },
  },
  saveSettings: {
    emoji: '💾',
    langs: {
      ru: 'Сохранить',
      'en-US': 'Save',
    },
  },
};

const getCommandByLang = lang => (command) => {
  const text = COMMANDS[command];
  const label = text.langs[lang] || text.langs[DELAULT_LANG];
  const emoji = text.emoji ? `${text.emoji} ` : '';
  return emoji + label;
};

const expressions = Object.entries(COMMANDS)
  .reduce((acc, [name, text]) => ({
    ...acc,
    [name]: new RegExp(`${text.emoji ? `${text.emoji} ` : ''}${Object.values(text.langs).join('|')}`),
  }), {
    changeSettings: new RegExp('[❌|✅] (.+)', 'i'),
  });

module.exports = {
  expressions,
  getCommandByLang,
};

