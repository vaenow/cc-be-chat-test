// plugin: common filed 
module.exports = function commonFiledPlugin(schema) {
  schema.add({
    // 创建时间
    createdAt: {
      type: Number,
      default: Date.now
    },
    // 修改时间
    updatedAt: {
      type: Number,
      default: Date.now
    },
    // 去掉__v
    __v: {
      type: Number,
      select: false
    }
  });
  schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
};
