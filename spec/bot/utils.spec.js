const {
  LABELS,
  ruLayout,
  defaultLayout,
  SUBSCRIBE_LABELS,
  UNSUBSCRIBE_LABELS,
} = require('../../bot/constants');
const {
  getLayout,
  vkPostProcess,
  buttonsLabels,
  toggleSubscribe,
} = require('../../bot/utils');

describe('#getLayout testing', () => {
  it('should return language reply keyboard layout', () => {
    expect(getLayout('ru')).toEqual(ruLayout);
    expect(getLayout('en-US')).toEqual(defaultLayout);
    expect(getLayout('none')).toEqual(defaultLayout);
  });
});

describe('#vkPostProcess testing', () => {
  const post = {
    owner_id: 1,
    id: 1,
    text: '#test@jasmine message1',
    is_pinned: 1,
  };

  const repost = {
    owner_id: 1,
    id: 1,
    text: '#test@jasmine #coverage@jasmine message2',
    is_pinned: 1,
    copy_history: [{
      owner_id: 2,
      id: 2,
      text: 'repost',
    }],
  };

  const regExp = new RegExp('#(test|coverage)@jasmine', 'gi');

  const processText = text => text.replace(regExp, (_, type) => `#${type}`);

  it('should process post without regExp', () => {
    const processedPost = {
      types: [],
      text: `[<b>PINNED</b>]\n${post.text}\n\nhttps://vk.com/wall${post.owner_id}_${post.id}`,
    };
    expect(vkPostProcess(post)).toEqual(processedPost);
  });

  it('should process repost without regExp', () => {
    const processedPost = {
      types: [],
      text: `[<b>PINNED</b>]\n${repost.text}\n\n[<b>REPOST</b> - https://vk.com/wall${repost.copy_history[0].owner_id}_${repost.copy_history[0].id}]\n${repost.copy_history[0].text}\n\nhttps://vk.com/wall${post.owner_id}_${post.id}`,
    };
    expect(vkPostProcess(repost)).toEqual(processedPost);
  });

  it('should process post with regExp', () => {
    const processedPost = {
      types: ['test'],
      text: `${processText(post.text)}\n\nhttps://vk.com/wall${post.owner_id}_${post.id}`,
    };
    expect(vkPostProcess(post, regExp)).toEqual(processedPost);
  });

  it('should process repost with regExp', () => {
    const processedPost = {
      types: ['test', 'coverage'],
      text: `${processText(repost.text)}\n\n[<b>REPOST</b> - https://vk.com/wall${repost.copy_history[0].owner_id}_${repost.copy_history[0].id}]\n${repost.copy_history[0].text}\n\nhttps://vk.com/wall${post.owner_id}_${post.id}`,
    };
    expect(vkPostProcess(repost, regExp)).toEqual(processedPost);
  });
});

describe('#buttonsLabels testing', () => {
  it('should return subscriber buttons', () => {
    expect(buttonsLabels(true)).toEqual([
      ...LABELS,
      ...UNSUBSCRIBE_LABELS,
    ]);
  });

  it('should return nonsubscriber buttons', () => {
    expect(buttonsLabels(false)).toEqual([
      ...LABELS,
      ...SUBSCRIBE_LABELS,
    ]);
  });
});

describe('#toggleSubscribe testing', () => {
  it('should return new user object', () => {
    const match = [0, 'test'];
    const oldUser = {
      name: 'user',
      subscribes: {
        coverage: true,
        test: false,
      },
    };
    const isSubscribe = true;

    const newUser = {
      name: 'user',
      subscribes: {
        coverage: true,
        test: true,
      },
    };

    expect(toggleSubscribe(match, oldUser, isSubscribe)).toEqual(newUser);
  });
});
