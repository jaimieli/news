'use strict';

var express = require('express');
var controller = require('./gTrends.controller');

var router = express.Router();

router.post('/getArticle', controller.getArticle);
router.get('/getTrends', controller.trends);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;