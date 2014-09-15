/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gtrends = require('./gTrends.model');

exports.register = function(socket) {
  Gtrends.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Gtrends.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('gTrends:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('gTrends:remove', doc);
}