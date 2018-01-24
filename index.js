const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { onVkPost, subscribeNotPrivate } = require('./bot/helpers');
const { bot, botUrl } = require('./bot/index');

const app = express();
app.use(bodyParser.json());
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Mongo connected!');

    app.post(botUrl, (req, res) => {
      const msg = req.body.message;
      if (msg.chat.type !== 'private' && msg.new_chat_participant && msg.new_chat_participant.is_bot) {
        bot.getMe()
          .then(info => subscribeNotPrivate(info, msg))
          .catch(e => console.log(e));
      } else if (msg.chat.type === 'private') {
        bot.processUpdate(req.body);
      }
      res.sendStatus(200);
    });

    app.post('/api/vk', onVkPost(bot));

    app.listen(process.env.PORT, () => {
      console.log(`Express server is listening on ${process.env.PORT}`);
      bot.setWebHook(`${process.env.HOOK_URL}${botUrl}`);
    });
  })
  .catch(() => console.log('Mongo connect failed!'));
