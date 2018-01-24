const KeenTracking = require('keen-tracking');

const keenClient = new KeenTracking({
  writeKey: process.env.KEEN_WRITE_KEY,
  projectId: process.env.KEEN_PROJECT_ID,
});

const addEventTemplate = type => params => keenClient.recordEvent(type, params);
const events = {
  keenOnStart: 'onStart',
  keenOnSubscribe: 'onSubscribe',
  keenOnUnsubscribe: 'onUnsubscribe',
  keenOnChangeSubscribe: 'onChangeSubscribe',
};

const eventsFns = Object.entries(events)
  .reduce((acc, [eventName, eventType]) => ({ ...acc, [eventName]: addEventTemplate(eventType) }), {});

module.exports = eventsFns;
