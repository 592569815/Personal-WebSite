'use strict';
const Controller = require('egg').Controller;

class TableController extends Controller {
  async getAllCountry () {
    const { ctx, app } = this;
    try {
      const prm = this.ctx.formatResponse.prm;
      const offset = this.ctx.formatResponse.skip;
      const limit = this.ctx.formatResponse.pageSize;
      const where = {};
      const searchType = ['countryEn', 'countryCn', 'code'];
      console.log('prm', prm)
      if (prm.keyword && searchType.includes(prm.searchType)) {
        prm.keyword = prm.keyword.replace(/，/g, ",");
        let isBlurry = true;
        if (prm.keyword.search(',') > 0) {
          isBlurry = false;
        }
        if (prm.searchType) {
          if (!isBlurry) {
            const keywordArr = prm.keyword.split(",");
            const newKeywordArr = [];
            keywordArr.map(li => {
              if (li) {
                newKeywordArr.push(li);
              }
            });
            where[prm.searchType] = {
              [Op.in]: newKeywordArr
            };
          } else {
            where[prm.searchType] = {
              [Op.like]: `%${prm.keyword}%`
            };
          }
        }
      } else if ((!prm.keyword && prm.searchType) || (prm.keyword && !prm.searchType)) {
        throw new Error("参数错误");
      }
      // 获取数据
      const list = await ctx.service.table.findCountry({
        limit,
        offset,
        where,
        orders: [
            ['code', 'asc']
        ]
      });
      // const list = await app.model.Country.findAll();
      // let list = await ctx.service.table.findCountry()
      // 数据组装
      let newList = list.map(itm => {
        var o = {};
        o['code'] = itm.code;
        o['cn'] = itm.chineseName;
        o['en'] = itm.englishName;
        o['createTime'] = app.dateFormat(itm.createTime);
        o['updateTime'] = app.dateFormat(itm.updateTime);
        return o;
      })
      // 格式化数据
      ctx.formatResponse.list = newList;
      const body = ctx.formatResponse.formattedRes();
      ctx.body = body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = TableController