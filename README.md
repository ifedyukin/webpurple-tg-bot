# WebPurple Telegram bot
[![Build Status](https://travis-ci.org/ifedyukin/webpurple-tg-bot.svg?branch=master)](https://travis-ci.org/ifedyukin/webpurple-tg-bot)
[![Telegram Bot](https://img.shields.io/badge/Telegram-%40WebPurple__bot-0088cc.svg)](https://t.me/WebPurple_bot)
[![Dependency status](https://david-dm.org/ifedyukin/webpurple-tg-bot/status.png)](https://david-dm.org/ifedyukin/webpurple-tg-bot#info=dependencies&view=table)
[![Dev Dependency Status](https://david-dm.org/ifedyukin/webpurple-tg-bot/dev-status.png)](https://david-dm.org/ifedyukin/webpurple-tg-bot#info=devDependencies&view=table)
[![Deploy to Heroku](https://img.shields.io/badge/Deploy_to-Heroku-9777ba.svg)](https://heroku.com/deploy?template=https://github.com/ifedyukin/webpurple-tg-bot)    

Ryazan FrontEnd community bot.    
Project plan - "[bot](https://github.com/ifedyukin/webpurple-tg-bot/projects/1)".    
Contribute to our [site project](https://github.com/kitos/web-purple) - [@kitos/web-purple](https://github.com/kitos/web-purple).    

### Features:
* Send last post from VKontakte community;
* Send future events information - Moscow time (GMT+3);
* Send Community and Contribution links;
* New posts subscription;
* News category filtering;
* Posting news from VKontakte in public chats and channels;
* Multilanguage messages.

### ENV variables
| Key  | Values |
| ------------- | ------------- |
| BOT_TOKEN  | Telegram bot-API token  |
| EVENT_SEARCH  | VKontakte event search query  |
| HOOK_URL  | Telegram bot WebHook url (e.g. `https://example.com`) |
| KEEN_API_URL  | Keen API url  |
| KEEN_PROJECT_ID  | Keen project id  |
| KEEN_WRITE_KEY  | Keen API write key  |
| MONGODB_URI  | MongoDB full url  |
| VK_COMMUNITY  | VKontakte community domain  |
| VK_KEY  | VKontakte secret key (`any`) |
| VK_RESPONSE  | VKontakte WebHook response  |
| VK_SERVICE  | VKontakte Service Token  |
| VK_TOKEN  | VKontakte Community Token  |
| VK_USER_TOKEN  | VKontakte User Token  |
