const mongoose = require('mongoose');

const CONFIG = {
  // 数据库
  NAME: process.env.MONGO_DBNAME,
  // 用户名 (无用户名为空字符串)
  USERNAME: process.env.MONGO_USER,
  // 密码 (无用户名为空字符串)
  PASSWORD: process.env.MONGO_PASSWORD,
  // host
  HOST: process.env.MONGO_HOST,
  // 端口
  PORT: process.env.MONGO_PORT,
  // host2
  HOST_SLAVE: process.env.MONGO_HOST_SLAVE,
  // port2
  PORT_SLAVE: process.env.MONGO_PORT_SLAVE,
  // replicaSet
  REPLICA_SET: process.env.REPLICA_SET,
};
console.log(CONFIG);
mongoose.Promise = global.Promise;

if (CONFIG.HOST_SLAVE) {
  mongoose.connect(
    `mongodb://${
      CONFIG.USERNAME ? `${CONFIG.USERNAME}:${CONFIG.PASSWORD}@` : ''
    }${CONFIG.HOST}:${CONFIG.PORT},${CONFIG.HOST_SLAVE}:${CONFIG.PORT_SLAVE}/${
      CONFIG.NAME
    }?replicaSet=${CONFIG.REPLICA_SET}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
} else {
  mongoose.connect(
    `mongodb://${
      CONFIG.USERNAME ? `${CONFIG.USERNAME}:${CONFIG.PASSWORD}@` : ''
    }${CONFIG.HOST}:${CONFIG.PORT}/${CONFIG.NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
}

module.exports = mongoose;
