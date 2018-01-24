const {
  LABELS,
  ruLayout,
  defaultLayout,
  SUBSCRIBE_LABELS,
  UNSUBSCRIBE_LABELS,
} = require('../../bot/constants');
const {
  getLayout,
  getEventDate,
  vkPostProcess,
  buttonsLabels,
  vkEventProcess,
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

describe('#vkEventProcess testing', () => {
  const event1 = {
    name: 'event1',
    id: 1,
    start_date: 1528801200,
    description: 'description1',
  };

  const event2 = {
    name: 'event2',
    id: 2,
    place: {
      address: 'Pushkina street, Kolotushkina house',
    },
    description: 'description2',
  };

  const uid = 0;

  const options = {
    parse_mode: 'HTML',
  };

  const processEvent = (text, event) => vkEventProcess(uid, {
    sendMessage: (userId, msg, opt) => {
      expect(userId).toEqual(uid);
      expect(opt).toEqual(options);
      expect(msg).toEqual(text);
    },
  })(event);

  it('should return event message', () => {
    let text;
    text = `<b>${event1.name}</b>\n`;
    text += `<i>${getEventDate(new Date(event1.start_date * 1000))}</i>\n`;
    text += `\n${event1.description.slice(0, 200)}...\n`;
    text += `\nhttps://vk.com/event${event1.id}`;
    processEvent(text, event1);
  });

  it('should return event message', () => {
    let text;
    text = `<b>${event2.name}</b>\n`;
    text += `<i>${event2.place.address}</i>\n`;
    text += `\n${event2.description.slice(0, 200)}...\n`;
    text += `\nhttps://vk.com/event${event2.id}`;
    processEvent(text, event2);
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
