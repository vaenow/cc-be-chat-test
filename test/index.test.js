/* eslint-disable */
require('dotenv').load('../.env');
const app = require('../app');
const { test } = require('ava');
const superkoa = require('superkoa');
const bootup = superkoa(app);

test.cb('ws index', t => {
  bootup
    .get('/v1/')
    .expect(200, (err, res) => {
      t.ifError(err);
      console.log(JSON.stringify(res.body, null, 2));
      t.end();
    });
});

/* eslint-enable */
