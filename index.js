const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { bot, botUrl } = require('./bot/index');
const {
  onVkPost,
  subscribeNotPrivate,
  uncaughtExceptionHandler,
} = require('./bot/helpers');
const {
  port,
  hookUrl,
  mongoDB,
  isProduction,
} = require('./config');

const app = express();
app.use(bodyParser.json());
mongoose.Promise = Promise;
process.on('uncaughtException', uncaughtExceptionHandler);

mongoose.connect(mongoDB)
  .then(() => {
    console.log('Mongo connected!');

    app.post(botUrl, (req, res) => {
      const msg = req.body.message;
      if (msg.chat.type !== 'private' && msg.new_chat_participant && msg.new_chat_participant.is_bot) {
        bot.getMe()
          .then(info => subscribeNotPrivate(info, msg))
          .catch(console.log);
      } else if (msg.chat.type === 'private') {
        bot.processUpdate(req.body);
      }
      res.sendStatus(200);
    });

    app.post('/api/vk', onVkPost(bot));

    app.listen(port, () => {
      console.log(`Express server is listening on ${port}`);
      if (isProduction) {
        bot.setWebHook(`${hookUrl}${botUrl}`);
      }
    });
  })
  .catch(console.log);
