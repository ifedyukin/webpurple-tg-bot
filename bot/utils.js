const ics = require('ics');
const fetch = require('node-fetch');
const { promisify } = require('util');
const FormData = require('form-data');
const eventModel = require('../models/event');
const {
  GMT,
  LABELS,
  ruLayout,
  POST_TYPES,
  defaultLayout,
  SUBSCRIBE_LABELS,
  UNSUBSCRIBE_LABELS,
} = require('./constants');
const { botToken } = require('../config');

const textRegExpProcessor = text => text
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\[([^|\]]+)\|([^\]]+)\]/ig, '<a href="https://vk.com/$1">$2</a>');

const isSupportType = match => POST_TYPES.includes(match[1].toLowerCase());

const toggleSubscribe = (match, oldUser, isSubscribe) => ({
  ...oldUser,
  subscribes: {
    ...oldUser.subscribes, [match[1].toLowerCase()]: isSubscribe,
  },
});

const validFileName = str => str.replace(/[/\\:|*?"<>]/ig, ' ');

const isTypeSubscribed = text => text[0] === '✅';

const subscribeButtons = isSubscribe => (isSubscribe ? UNSUBSCRIBE_LABELS : SUBSCRIBE_LABELS);

const buttonsLabels = isSubscribe => [
  ...LABELS,
  ...subscribeButtons(isSubscribe),
];

const getLayout = (lang) => {
  switch (lang) {
    case 'ru':
    case 'ru-RU':
      return [...ruLayout];
    case 'en-US':
    default:
      return [...defaultLayout];
  }
};

const vkPostProcess = ({
  owner_id: ownerId, id, text, copy_history: copyHistory, is_pinned: isPinned,
}, regExp = null) => {
  const url = `https://vk.com/wall${ownerId}_${id}`;
  const pin = regExp === null && isPinned;
  const types = [];
  let formattedText = textRegExpProcessor(regExp !== null ? text.replace(regExp, (_, type) => {
    types.push(type);
    return `#${type}`;
  }) : text);

  if (copyHistory && copyHistory[0]) {
    const { owner_id: oId, id: pId } = copyHistory[0];
    formattedText += `\n\n[<b>REPOST</b> - https://vk.com/wall${oId}_${pId}]\n` + // eslint-disable-line prefer-template
      textRegExpProcessor(copyHistory[0].text) || '';
  }

  return {
    text: (pin ? '[<b>PINNED</b>]\n' : '') + formattedText + '\n\n' + url, // eslint-disable-line prefer-template
    types,
  };
};

const formatSingleNum = (num = 0) => {
  const str = num.toString();
  if (str.length >= 2) return str;
  return `0${str}`;
};

const getEventDate = (date) => {
  const formattedDate = new Date(date.setUTCHours(date.getHours() + GMT));
  const d = `${formatSingleNum(formattedDate.getDate())}.${formatSingleNum(formattedDate.getMonth() + 1)}.${formattedDate.getFullYear()}`;
  const t = `${formatSingleNum(formattedDate.getHours())}:${formatSingleNum(formattedDate.getMinutes())} (GMT+${GMT})`;
  return `${d} ${t}`;
};

const getIcsDate = (date) => {
  const formattedDate = new Date(date.setUTCHours(date.getHours()));
  return [
    formattedDate.getFullYear(),
    formattedDate.getMonth() + 1,
    formattedDate.getDate(),
    formattedDate.getHours(),
    formattedDate.getMinutes(),
  ];
};

const promisifedIcsCreate = promisify(ics.createEvent);
const createIcsFile = (event) => {
  const item = {
    title: event.title,
    description: event.description,
    start: event.start,
    location: event.location,
    url: event.url,
    status: event.status,
  };

  if (event.end) {
    item.end = event.end;
  } else {
    item.duration = event.duration;
  }

  return promisifedIcsCreate(item);
};

const vkEventProcess = (uid, bot) => ({
  name, id, start_date: startDate, place, description, end_date: endDate,
}) => {
  let text;
  text = `<b>${name}</b>\n`;
  text += startDate ? `<i>${getEventDate(new Date(startDate * 1000))}</i>\n` : '';
  text += place && place.address ? `<i>${place.address}</i>\n` : '';
  text += description ? `\n${description.slice(0, 200)}...\n` : '';
  text += `\nhttps://vk.com/event${id}`;

  return bot.sendMessage(uid, text, {
    parse_mode: 'HTML',
  })
    .then(() => {
      let eventObject = null;
      const formData = new FormData();
      formData.append('chat_id', uid);

      return eventModel.findOne({ id }).exec()
        .then((event) => {
          if (event) {
            eventObject = event.toObject();
            if (event.file_id) {
              return formData.append('document', event.file_id);
            }
            return createIcsFile(event).then(doc => formData.append('document', Buffer.from(doc, 'utf-8'), { filename: `${validFileName(name)}.ics` }));
          }

          eventObject = {
            id,
            title: name,
            description,
            start: getIcsDate(new Date(startDate * 1000)),
            location: (place && place.address) || '',
            url: `https://vk.com/event${id}`,
            status: 'CONFIRMED',
            end: endDate ? getIcsDate(new Date(endDate * 1000)) : null,
            duration: endDate ? null : { hours: 1, minutes: 30 },
          };

          return eventModel.create(eventObject)
            .then(() => createIcsFile(eventObject)
              .then(doc => formData.append('document', Buffer.from(doc, 'utf-8'), { filename: `${validFileName(name)}.ics` })));
        })
        .then(() => fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          headers: formData.getHeaders(),
          method: 'POST',
          body: formData,
        }))
        .then(r => r.json())
        .then((r) => {
          if (!eventObject.file_id) {
            const docId = r.result && r.result.document ? r.result.document.file_id : null;
            return eventModel.findOneAndUpdate(
              { id: eventObject.id },
              { ...eventObject, file_id: docId },
            ).exec();
          }
          return Promise.resolve();
        });
    })
    .catch(console.log);
};

module.exports = {
  getLayout,
  getIcsDate,
  getEventDate,
  vkPostProcess,
  createIcsFile,
  buttonsLabels,
  isSupportType,
  vkEventProcess,
  toggleSubscribe,
  isTypeSubscribed,
};
