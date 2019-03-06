'use strict';
const Controller = require('egg').Controller;

class TableController extends Controller {
    async getAllCountry () {
        const { ctx, app } = this;
        try {
            const list = await app.model.Country.findAll();
            let newList = list.map(itm => {
                var o = {};
                o['code'] = itm.code;
                o['cn'] = itm.chineseName;
                o['en'] = itm.englishName;
                o['createTime'] = app.dateFormat(itm.createTime);
                o['updateTime'] = app.dateFormat(itm.updateTime);
                return o;
            })
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