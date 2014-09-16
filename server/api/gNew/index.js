'use strict';

var express = require('express');
var controller = require('./gNew.controller');

var router = express.Router();

router.post('/getEntities', controller.showEntity);
router.post('/getArticle', controller.getArticle);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;