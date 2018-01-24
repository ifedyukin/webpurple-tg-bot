const {
  ruLayout,
  defaultLayout,
} = require('../../bot/constants');
const {
  getLayout,
} = require('../../bot/utils');

describe('#getLayout testing', () => {
  it('should return language reply keyboard layout', () => {
    expect(getLayout('ru')).toEqual(ruLayout);
    expect(getLayout('en-US')).toEqual(defaultLayout);
    expect(getLayout('none')).toEqual(defaultLayout);
  });
});

