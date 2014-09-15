/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Twitter = require('./twitter.model');

exports.register = function(socket) {
  Twitter.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Twitter.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('twitter:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('twitter:remove', doc);
}