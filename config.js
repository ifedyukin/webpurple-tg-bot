module.exports = {
  port: process.env.PORT || 8000,
  isProduction: process.env.NODE_ENV !== 'development',
  mongoDB: process.env.MONGODB_URI || 'mongodb://localhost/webpurple-tg-bot',
  hookUrl: process.env.HOOK_URL || 'url',
  botToken: process.env.BOT_TOKEN || 'token',
  vkSecret: process.env.VK_KEY || 'secret',
  vkResponse: process.env.VK_RESPONSE || 'ok',
  eventSearch: process.env.EVENT_SEARCH || 'event',
  vkUserKey: process.env.VK_USER_TOKEN || 'user token',
  vkCommunity: process.env.VK_COMMUNITY || 'webpurple',
  vkServiceKey: process.env.VK_SERVICE || 'service token',
};
