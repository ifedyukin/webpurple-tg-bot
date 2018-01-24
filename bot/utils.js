const {
  GMT,
  LABELS,
  ruLayout,
  POST_TYPES,
  defaultLayout,
  SUBSCRIBE_LABELS,
  UNSUBSCRIBE_LABELS,
} = require('./constants');

const isSupportType = match => POST_TYPES.includes(match[1].toLowerCase());

const toggleSubscribe = (match, oldUser, isSubscribe) => ({
  ...oldUser,
  subscribes: {
    ...oldUser.subscribes, [match[1].toLowerCase()]: isSubscribe,
  },
});

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
  let formattedText = regExp !== null ? text.replace(regExp, (_, type) => {
    types.push(type);
    return `#${type}`;
  }) : text;

  if (copyHistory && copyHistory[0]) {
    const { owner_id: oId, id: pId } = copyHistory[0];
    formattedText += `\n\n[<b>REPOST</b> - https://vk.com/wall${oId}_${pId}]\n` + // eslint-disable-line prefer-template
      copyHistory[0].text || '';
  }

  return {
    text: (pin ? '[<b>PINNED</b>]\n' : '') + formattedText + '\n\n' + url, // eslint-disable-line prefer-template
    types,
  };
};

const formetSingleNum = (num = 0) => {
  const str = num.toString();
  if (str.length >= 2) return str;
  return `0${str}`;
};

const getEventDate = (date) => {
  let hours = date.getHours() + GMT;
  if (hours > 23) hours = 24 - hours;

  const d = `${formetSingleNum(date.getDate())}.${formetSingleNum(date.getMonth() + 1)}.${date.getFullYear()}`;
  const t = `${formetSingleNum(hours)}:${formetSingleNum(date.getMinutes())} (GMT+${GMT})`;
  return `${d} ${t}`;
};

const vkEventProcess = (uid, bot) => ({
  name, id, start_date: startDate, place, description,
}) => {
  let text;
  text = `<b>${name}</b>\n`;
  text += startDate ? `<i>${getEventDate(new Date(startDate * 1000))}</i>\n` : '';
  text += place && place.address ? `<i>${place.address}</i>\n` : '';
  text += description ? `\n${description.slice(0, 200)}...\n` : '';
  text += `\nhttps://vk.com/event${id}`;

  bot.sendMessage(uid, text, {
    parse_mode: 'HTML',
  });
};

module.exports = {
  getLayout,
  vkPostProcess,
  buttonsLabels,
  isSupportType,
  vkEventProcess,
  toggleSubscribe,
  isTypeSubscribed,
};
