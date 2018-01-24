const { PROFILES, CONTRIBUTE, DELAULT_LANG } = require('../constants');

const profilesLabels = {
  website: {
    emoji: '🔗',
    langs: {
      ru: 'Сайт',
      'en-US': 'Website',
    },
  },
  telegram: {
    emoji: '💬',
    langs: {
      ru: 'Чат в Telegram',
      'en-US': 'Telegram chat',
    },
  },
  vkontakte: {
    emoji: '📘',
    langs: {
      ru: 'Группа ВКонтакте',
      'en-US': 'VKontakte group',
    },
  },
  youtube: {
    emoji: '📺',
    langs: {
      ru: 'YouTube-канал',
      'en-US': 'YouTube channel',
    },
  },
  instagram: {
    emoji: '📸',
    langs: {
      ru: 'Профиль в Instagram',
      'en-US': 'Instagram profile',
    },
  },
  facebook: {
    emoji: '📰',
    langs: {
      ru: 'Сообщество Facebook',
      'en-US': 'Facebook community',
    },
  },
};

const contributeLabels = {
  website: {
    emoji: '🔗',
    langs: {
      ru: 'GitHub сайта',
      'en-US': 'Website GitHub',
    },
  },
  contributors: {
    emoji: '🖼',
    langs: {
      ru: 'Наши активисты',
      'en-US': 'Our contributors',
    },
  },
  speaker: {
    emoji: '🎙',
    langs: {
      ru: 'Выступить с докладом',
      'en-US': 'Become a speaker',
    },
  },
  bot: {
    emoji: '🤖',
    langs: {
      ru: 'GitHub бота',
      'en-US': 'Telegram bot GitHub',
    },
  },
};

const getLinksByLang = (data, labels) => lang => Object.keys(data)
  .map((profile) => {
    const link = labels[profile];
    if (!link) return null;
    return [{
      text: `${link.emoji || ''} ${link.langs[lang] || link.langs[DELAULT_LANG]}`,
      url: data[profile],
    }];
  }).filter(f => f);

module.exports = {
  getProfilesByLang: getLinksByLang(PROFILES, profilesLabels),
  getProjectsByLang: getLinksByLang(CONTRIBUTE, contributeLabels),
};
