const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { onVkPost } = require('./bot/heplers');
const { bot, botUrl } = require('./bot/index');

const app = express();
app.use(bodyParser.json());
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Mongo connected!');

    app.post(botUrl, (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });

    app.post('/api/vk', onVkPost(bot));

    app.listen(process.env.PORT, () => {
      console.log(`Express server is listening on ${process.env.PORT}`);
      bot.setWebHook(`${process.env.HOOK_URL}${botUrl}`);
    });
  })
  .catch(() => console.log('Mongo connect failed!'));
