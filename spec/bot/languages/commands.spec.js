const { DELAULT_LANG } = require('../../../bot/constants');
const { getCommandByLang } = require('../../../bot/languages/commands');

const commands = {
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
};

describe('Multilanguage commands support', () => {
  const commandWithEmoji = 'contribute';
  const commandWithoutEmoji = 'start';

  const testCommands = (lang) => {
    const getCommand = getCommandByLang(lang);

    it(`should return simple command without emoji [${lang}]`, () => {
      const command = getCommand(commandWithoutEmoji);
      const expectedCommand = commands[commandWithoutEmoji];

      expect(command).toBe(expectedCommand.langs[lang] || expectedCommand.langs[DELAULT_LANG]);
    });

    it(`should return simple command with emoji [${lang}]`, () => {
      const command = getCommand(commandWithEmoji);
      const expectedCommand = commands[commandWithEmoji];

      expect(command).toBe(`${expectedCommand.emoji} ${expectedCommand.langs[lang] || expectedCommand.langs[DELAULT_LANG]}`);
    });
  };

  testCommands('en-US');
  testCommands('ru');
  testCommands('none');
});
