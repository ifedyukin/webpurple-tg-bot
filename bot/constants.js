const {
  vkUserKey,
  vkCommunity,
  vkServiceKey,
} = require('../config');

const PROFILES = {
  website: 'http://www.webpurple.net/',
  telegram: 'https://t.me/WebPurple',
  vkontakte: 'https://vk.com/webpurple',
  youtube: 'https://www.youtube.com/channel/UCFOQWgbqJbU8sVuWHGln2aA',
  instagram: 'https://www.instagram.com/webpurple/',
  facebook: 'https://www.facebook.com/WebPurple',
};

const CONTRIBUTE = {
  website: 'https://github.com/kitos/web-purple',
  contributors: 'http://webpurple.net/contributors',
  speaker: 'https://vk.com/webpurple',
  bot: 'https://github.com/ifedyukin/webpurple-tg-bot',
};

const DELAULT_LANG = 'en-US';

const GMT = 3;

const POST_TYPES = ['no tag', 'events', 'news', 'study'];

const LABELS = [
  'lastNews',
  'nextEvent',
  'community',
  'contribute',
];

const SUBSCRIBE_LABELS = ['subscribe', null];

const UNSUBSCRIBE_LABELS = ['unsubscribe', 'settings'];

const ruLayout = [1, 1, 2, 2];

const defaultLayout = [2, 2, 2];

const VK_REQUESTS = {
  getWall: `https://api.vk.com/method/wall.get?count=5&domain=${vkCommunity}&access_token=${vkServiceKey}&v=5.71`,
  getGroups: groups => `https://api.vk.com/method/groups.getById?group_ids=${groups.join(',')}&fields=name,description,start_date,place&access_token=${vkUserKey}&v=5.71`,
};

module.exports = {
  GMT,
  LABELS,
  ruLayout,
  PROFILES,
  CONTRIBUTE,
  POST_TYPES,
  VK_REQUESTS,
  DELAULT_LANG,
  defaultLayout,
  SUBSCRIBE_LABELS,
  UNSUBSCRIBE_LABELS,
};
