const { DELAULT_LANG } = require('../../../bot/constants');
const {
  getSubscribeSettingsMessage,
  getSaveSubscribesMessage,
} = require('../../../bot/languages/messages');

const messages = {
  getSubscribeSettingsMessage: {
    ru: 'Выберите тип записей для подписки:',
    'en-US': 'Select subscribed posts type:',
  },
  getSaveSubscribesMessage: {
    ru: 'Настройки подписок были сохранены!',
    'en-US': 'Subscribe settings were saved!',
  },
};

describe('Multilanguage messages support', () => {
  const testMessage = (lang) => {
    it(`should return subscribe message [${lang}]`, () => {
      const message = getSubscribeSettingsMessage(lang);
      const expectedMessage = messages.getSubscribeSettingsMessage[lang]
        || messages.getSubscribeSettingsMessage[DELAULT_LANG];

      expect(message).toBe(expectedMessage);
    });

    it(`should return saved subscribes message [${lang}]`, () => {
      const message = getSaveSubscribesMessage(lang);
      const expectedMessage = messages.getSaveSubscribesMessage[lang]
        || messages.getSaveSubscribesMessage[DELAULT_LANG];

      expect(message).toBe(expectedMessage);
    });
  };

  testMessage('en-US');
  testMessage('ru');
  testMessage('none');
});
