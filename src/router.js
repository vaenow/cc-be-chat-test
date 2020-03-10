const router = require('koa-router')();

const ws = require('./controllers/ws');

router.get('/', ws.index);
router.post('/', ws.p);

module.exports = router;