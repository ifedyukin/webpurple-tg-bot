const { DELAULT_LANG, PROFILES, CONTRIBUTE } = require('../../../bot/constants');
const { getProfilesByLang, getProjectsByLang } = require('../../../bot/languages/links');

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
};
const testingContributes = Object.keys(contributeLabels);
const getContributeLabel = index => contributeLabels[testingContributes[index]];

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
};
const testingProfiles = Object.keys(profilesLabels);
const getProfileLabel = index => profilesLabels[testingProfiles[index]];


describe('Multilanguage links support', () => {
  const testLinks = (lang) => {
    it(`should return profiles links [${lang}]`, () => {
      const links = getProfilesByLang(lang).slice(0, 2);
      links.forEach((link, index) => {
        const exprectedLink = getProfileLabel(index);
        expect(link[0].text).toBe(`${exprectedLink.emoji} ${exprectedLink.langs[lang] || exprectedLink.langs[DELAULT_LANG]}`);
        expect(link[0].url).toBe(PROFILES[testingProfiles[index]]);
      });
    });

    it(`should return contribute links [${lang}]`, () => {
      const links = getProjectsByLang(lang).slice(0, 2);
      links.forEach((link, index) => {
        const exprectedLink = getContributeLabel(index);
        expect(link[0].text).toBe(`${exprectedLink.emoji} ${exprectedLink.langs[lang] || exprectedLink.langs[DELAULT_LANG]}`);
        expect(link[0].url).toBe(CONTRIBUTE[testingContributes[index]]);
      });
    });
  };

  testLinks('en-US');
  testLinks('ru');
  testLinks('none');
});
