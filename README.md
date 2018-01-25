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
* Easy Heroku deploy;
* Simple locale debug;
* Posting news from VKontakte in public chats and channels;
* Multilanguage messages.

### Development
#### Requirements
* Git;
* MongoDB;
* NodeJS, npm;
* Telegram: client, account;
* Heroku account (deploy test bot);
* VKontakte account (VK integrations).

#### ENV variables
| Key  | Values | How to get? |
| ------------- | ------------- |------------- |
| BOT_TOKEN  | Telegram bot-API token  | [Hot do I create bot?](https://core.telegram.org/bots#3-how-do-i-create-a-bot) |
| EVENT_SEARCH  | VKontakte event search query  |  Think about it :sunglasses:  |
| HOOK_URL  | Telegram bot WebHook url | For <u>Heroku</u>: `https://<your-app-name>.herokuapp.com`  |
| KEEN_PROJECT_ID  | Keen project id  | Autoconfigured for <u>Heroku</u> by `Keen` |
| KEEN_WRITE_KEY  | Keen API write key  | Autoconfigured for <u>Heroku</u> by `Keen` |
| MONGODB_URI  | MongoDB full url  | Autoconfigured for <u>Heroku</u> by `mLab` |
| VK_COMMUNITY  | VKontakte community domain  | Your community custom domain `https://vk.com/<domain>` |
| VK_KEY  | VKontakte secret key (`any`) | Think about it :sunglasses:  |
| VK_RESPONSE  | VKontakte WebHook response  | [VKontakte Callback API](https://vk.com/dev/callback_api) | 
| VK_SERVICE  | VKontakte Service Token  | [VKontakte Service Token](https://vk.com/dev/access_token?f=3.%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%BD%D1%8B%D0%B9%20%D0%BA%D0%BB%D1%8E%D1%87%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0) |
| VK_USER_TOKEN  | VKontakte User Token  | [VKontakte User Token](https://vk.com/dev/access_token?f=1.%20%D0%9A%D0%BB%D1%8E%D1%87%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F) |


#### Run bot locale
1. Configure [environment](https://github.com/ifedyukin/webpurple-tg-bot#env-variables) variables in `config.js` file.    
<u>Do not publish **access** keys to public!</u>    

2. Install and run application:
```bash
git clone https://github.com/ifedyukin/webpurple-tg-bot
cd webpurple-tg-bot
npm install
npm run development
```

#### Create Heroku instance and deploy bot
1. Click "[Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/ifedyukin/webpurple-tg-bot)" button in the top of `README`.
2. Follow the directions.
3.  Navigate to instance `Settings` page, click `Reveal Config Vars` and configure [environment](https://github.com/ifedyukin/webpurple-tg-bot#env-variables) variables.
4. Navigate to instance `Deploy` page, select deployment method (you can configure autodeploy from your fork repository).
