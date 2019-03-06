/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};
  config.formatResponse = {};
  config.erpToken = '95CB22A5-9C5F-4B05-C02B-20EA539CFE46';
  config.redis = {
    client: {
        port: 6379,
        password: '',
        host: '127.0.0.1',
        db: 0
    },
    agent: true
  };
  config.sequelize = {
    dialect: 'mysql',
    database: 'test', // newdb
    username: 'sa',
    password: 'Idh#168',
    host: '192.168.1.210',
    timezone: '+8:00',
    port: 3306,
    operatorsAliases: false,
    quoteIdentifiers: false,
    pool: {
        max: 20,
        min: 2,
        idle: 90000,
        acquire: 90000,
        evict: 90000
    },
    logging: false
  };
  config.sessionRedis = {};
  config.session = {
      renew: true,
  };
  config.security = {
    domainWhiteList: [ 'http://localhost:9528' ],
    xframe: {
        enable: false,
    },
    csrf: {
        useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
        cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
        sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
        enable: false,
        ignoreJSON: true
    },
};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551680486214_5621';

  // add your middleware config here
  config.middleware = ["myCors", "formatResponse"];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
