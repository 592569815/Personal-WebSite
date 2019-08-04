'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  static: true,
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  sessionRedis: {
    enable: false,
    package: 'egg-session-redis',
  },
  redis: {
    enable: false,
    package: 'egg-redis',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  mysql:{
    enable: false,
    package: 'egg-mysql',
  }
};
