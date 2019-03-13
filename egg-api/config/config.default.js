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
  config.erpToken = 'admin';
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
    database: 'qdm189967263_db', // newdb
    username: 'qdm189967263',
    password: 'Cyq19940802',
    host: 'qdm189967263.my3w.com',
    port: 3306,
    dialectOptions: {
      insecureAuth: true
    }
  };
  config.mysql = {
    client: {
      // host
      host: 'qdm189967263.my3w.com',
      // 端口号
      port: '3306',
      // 用户名
      user: 'qdm189967263',
      // 密码
      password: 'Cyq19940802',
      // 数据库名
      database: 'qdm189967263_db',
      insecureAuth: true, 
    },
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
      ignoreJSON: false
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551680486214_5621';

  // add your middleware config here
  config.middleware = ["myCors", "formatResponse"];
  config.formatResponse = {}; // 定义的中间件配置

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
