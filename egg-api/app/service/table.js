const Service = require('egg').Service;

class TableService extends Service {
  async findCountry(opt) {
    const data = await this.app.mysql.select('country', opt);
    return data;
  }
}
  
module.exports = TableService;