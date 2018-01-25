module.exports = {
  port: process.env.PORT || 8000,
  hookUrl: process.env.HOOK_URL || 'url',
  vkSecret: process.env.VK_KEY || 'secret',
  botToken: process.env.BOT_TOKEN || 'token',
  vkResponse: process.env.VK_RESPONSE || 'ok',
  eventSearch: process.env.EVENT_SEARCH || 'event',
  vkCommunity: process.env.VK_COMMUNITY || 'webpurple',
  isProduction: process.env.NODE_ENV !== 'development',
  vkUserKey: process.env.VK_USER_TOKEN || 'user token',
  vkServiceKey: process.env.VK_SERVICE || 'service token',
  mongoDB: process.env.MONGODB_URI || 'mongodb://localhost/webpurple-tg-bot',
};
