# WebPurple Telegram bot
[![Build Status](https://travis-ci.org/ifedyukin/webpurple-tg-bot.svg?branch=master)](https://travis-ci.org/ifedyukin/webpurple-tg-bot)
[![Telegram Bot](https://img.shields.io/badge/Telegram-%40WebPurple__bot-0088cc.svg)](https://t.me/WebPurple_bot)
[![Dependency status](https://david-dm.org/ifedyukin/webpurple-tg-bot/status.png)](https://david-dm.org/ifedyukin/webpurple-tg-bot)
[![Dev Dependency Status](https://david-dm.org/ifedyukin/webpurple-tg-bot/dev-status.png)](https://david-dm.org/ifedyukin/webpurple-tg-bot?type=dev)
[![Deploy to Heroku](https://img.shields.io/badge/Deploy_to-Heroku-9777ba.svg)](https://heroku.com/deploy?template=https://github.com/ifedyukin/webpurple-tg-bot)    

Ryazan FrontEnd community bot.    
Project plan - "[bot](https://github.com/ifedyukin/webpurple-tg-bot/projects/1)".    
Contribute to our [site project](https://github.com/kitos/web-purple) - [@kitos/web-purple](https://github.com/kitos/web-purple).    

### Features:
* Send last post from VKontakte community;
* Send future events information - Moscow time (GMT+3);
* Send Community and Contribution links;
* Send event ICS files;
* Send newsletter and delete messages by command;
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
| ENV Key  | `config.js` | Values | How to get? |
| ------------- | ------------- | ------------- |------------- |
| PORT  | port | Application port (`default: 8000`) | Autoconfigured for Heroku by runner |
| NODE_ENV  | isProduction | ENV | Autoconfigured: `NODE_ENV !== 'development'`  |
| MONGODB_URI | mongoDB  | MongoDB full url  | Autoconfigured for Heroku by `mLab` |
| HOOK_URL  | hookUrl |Telegram bot WebHook url | For Heroku: `https://<your-app-name>.herokuapp.com`  |
| BOT_TOKEN  | botToken | Telegram bot-API token  | [Hot do I create bot?](https://core.telegram.org/bots#3-how-do-i-create-a-bot) |
| VK_KEY | vkSecret | VKontakte secret key (`any`) | Think about it :sunglasses:  |
| VK_RESPONSE | vkResponse | VKontakte WebHook response  | [VKontakte Callback API](https://vk.com/dev/callback_api) | 
| VK_USER_TOKEN | vkUserKey | VKontakte User Token  | [VKontakte User Token](https://vk.com/dev/access_token?f=1.%20%D0%9A%D0%BB%D1%8E%D1%87%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F) |
| VK_COMMUNITY | vkCommunity | VKontakte community domain  | Your community custom domain `https://vk.com/<domain>` |
| VK_COMMUNITY_ID | vkCommunityId | VKontakte community id  | Your community id |
| VK_SERVICE | vkServiceKey | VKontakte Service Token  | [VKontakte Service Token](https://vk.com/dev/access_token?f=3.%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%BD%D1%8B%D0%B9%20%D0%BA%D0%BB%D1%8E%D1%87%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0) |
| KEEN_PROJECT_ID | none | Keen project id  | Autoconfigured for Heroku by `Keen` |
| KEEN_WRITE_KEY | none | Keen API write key  | Autoconfigured for Heroku by `Keen` |
| NOTIFY_USER | notifyUserId | Telegram user id  | User for error notification |


#### Run bot locale
1. Configure [environment](https://github.com/ifedyukin/webpurple-tg-bot#env-variables) variables in `config.js` file.    
Do not publish **access** keys to public!    

2. Install and run application:
```bash
git clone https://github.com/ifedyukin/webpurple-tg-bot
cd webpurple-tg-bot
npm install
npm run development
```

3. Run tests and linter
```bash
npm run test
npm run lint
```

#### Create Heroku instance and deploy bot
1. Click "[Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/ifedyukin/webpurple-tg-bot)" button in the top of `README`.
2. Follow the directions.
3.  Navigate to instance `Settings` page, click `Reveal Config Vars` and configure [environment](https://github.com/ifedyukin/webpurple-tg-bot#env-variables) variables.
4. Navigate to instance `Deploy` page, select deployment method (you can configure autodeploy from your fork repository).
