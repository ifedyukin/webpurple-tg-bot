const { isProduction } = require('../config');
const KeenTracking = require('keen-tracking');

const keenClient = isProduction ? new KeenTracking({
  writeKey: process.env.KEEN_WRITE_KEY,
  projectId: process.env.KEEN_PROJECT_ID,
}) : null;

const addEventTemplate = type => params => (isProduction ?
  keenClient.recordEvent(type, params) : console.log(type, params));

const events = {
  keenOnStart: 'onStart',
  keenOnAddToChat: 'onAddToChat',
  keenOnSubscribe: 'onSubscribe',
  keenOnUnsubscribe: 'onUnsubscribe',
  keenOnChangeSubscribe: 'onChangeSubscribe',
};

const eventsFns = Object.entries(events)
  .reduce((acc, [eventName, eventType]) => ({ ...acc, [eventName]: addEventTemplate(eventType) }), {});

module.exports = eventsFns;
