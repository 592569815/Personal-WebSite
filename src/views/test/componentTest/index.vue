<template>
    <div class="container">
        <div class="title"><b>闪耀暖暖竞技场兑换计算</b></div>
        <hr class="mhr">
        <div class="showTime">{{ getTitle }}</div>
        <!-- <p><button onclick="saveSettings()">保存设置</button><button onclick="loadSettings()">读取设置</button></p> -->
        <!-- 表格区域 -->
        <div class="table">
            <el-table :data="config.clothesInfo" size="mini" @row-click="rowClick" ref="table" stripe>
                <el-table-column
                    label="部位"
                    width="80px"
                    prop="type">
                </el-table-column>
                <el-table-column
                    label="服装名称">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type === '影之召唤'"> 
                            <el-select v-model="scope.row.qty" placeholder="请选择" @change="calc" size="mini">
                                <el-option v-for="item in config.skillLv" :key="item.label" :label="item.label" :value="item.value"></el-option>
                            </el-select> 
                        </div>
                        <div v-if="scope.row.type !== '影之召唤'"> {{ scope.row.name }} </div>
                    </template>    
                </el-table-column>
                <el-table-column
                    prop="need"
                    width="50px"
                    label="所需">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type === '影之召唤'"> 
                            {{ scope.row.need * scope.row.qty }}
                        </div>
                        <div v-if="scope.row.type !== '影之召唤'"> {{ scope.row.need }} </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="require"
                    label="所需竞技场等级"
                    width="200">
                </el-table-column> -->
                <el-table-column
                    width="50px"
                    label="已有">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="勾选代表已有/不需要部件" placement="top-start">
                            <el-checkbox v-model="scope.row.checked" @change="calc"></el-checkbox>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 每周购买礼包 -->
        <div class="input weekBuy">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>每周购买礼包</span>
                </div>
                <div v-for="item in config.packageInfo" :key="item.name" class="el-row">
                    <el-col :span="18">
                        <el-input type="number" placeholder="请输入数量" v-model.number="item.amount" :min="0" :max="item.max" size="mini" @change="calc" @input.native="item.amount = checkMax($event, item.max)">
                            <template slot="prepend">{{ item.name }}</template>
                            <template slot="append">个</template>
                        </el-input>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <div class="total">{{ '所需: ' + Number(item.amount) * item.price }}</div>
                    </el-col>
                </div>
            </el-card>
        </div>
        <div class="input">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>相关信息</span>
                </div>
                <el-form ref="form" :model="form" label-width="120px" size="mini">
                    <el-form-item :label="'当前' + config.itemName + ': '">
                        <el-input type="number" placeholder="请输入数量" v-model.number="form.currentAmount" :min="0" :max="999999" @change.native="calc" @input.native="form.currentAmount = checkMax($event, 999999)">
                            <template slot="append">个</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="平均结算段位: ">
                        <el-select v-model="form.finalLevel" placeholder="请选择段位" @change="calc">
                            <el-option v-for="item in config.levelList" :key="item.name" :label="item.name" :value="item.num">{{ item.name }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="今日剩余免费: ">
                        <el-input type="number" placeholder="请输入次数" v-model.number="form.todayRemain" :min="0" :max="5" @change.native="calc" @input.native="form.todayRemain = checkMax($event, 5)">
                            <template slot="append">次</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="今日还可以购买: ">
                        <el-input type="number" placeholder="请输入次数" v-model.number="form.todayBuy" :min="0" :max="15" @change.native="calc" @input.native="form.todayBuy = checkMax($event, 15)"> 
                            <template slot="append">次</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="预计胜率: ">
                        <el-input type="number" placeholder="请输入胜率" v-model.number="form.winRate" :min="0" :max="100" @change.native="calc" @input.native="form.winRate = checkMax($event, 100)">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="计划最高段位: ">
                        <el-select v-model="form.topupPlan" placeholder="请选择段位" @change="calc">
                            <el-option v-for="item in config.topup" :key="item.key" :label="item.name" :value="item.key">{{ item.name }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="已达最高段位: ">
                        <el-select v-model="form.currentLevel" placeholder="请选择段位" @change="calc">
                            <el-option v-for="item in config.topup" :key="item.key" :label="item.name" :value="item.key">{{ item.name }}</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div id="calc">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>计算结果</span>
                </div>
                <div>
                    <div class="box-item"> 共需 <el-tag type="success" size="small">{{ result.totalNeed }}</el-tag> 个 {{ config.itemName }}    </div>
                    <div class="box-item"> 免费 <el-tag type="success" size="small">{{ result.free }}</el-tag> 个 {{ config.itemName }}  ( 挑战奖励 {{ result.freeFight }}, 周结算 {{ result.weeksettle }}, 段位提升 {{ result.levelUp }} ) </div>
                    <div class="box-item"> 还差 <el-tag type="danger" size="small"> {{ result.remain }} </el-tag> 个{{ config.itemName }}, 需购买 <el-tag type="danger" size="small"> {{ result.needBuy }} </el-tag> 次 </div>
                    <div class="box-item"> 赛季结束前 <el-tag v-show="result.calcres" type="success" size="small">可以</el-tag> <el-tag v-show="!result.calcres" type="danger" size="small">不能</el-tag> 兑换完所有部件<span v-show="!result.calcres">，请调整目标需求</span> </div>
                    <div class="box-item" v-show="result.calcres"> 需要花钻 <el-tag type="success" size="small">{{ result.needPay }}</el-tag> </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'JJC',
    data() {
        return {
            // 配置信息
            config: {
                timeEnd: Date.parse('2019-08-11 05:00:00'), // 结束时间 
                timeNow: new Date().getTime(), // 现在时间
                clothesInfo: [ // 服装信息
                    { type: '特殊-翅膀', name: '记忆残翼', require: '永恒的传奇', need: 1188, checked: false },
                    { type: '手持物', name: '温柔祷歌', require: '颠覆未来之王3星', need: 792, checked: false },
                    { type: '美瞳', name: '蝴蝶之梦', require: '颠覆未来之王2星', need: 528, checked: false },
                    { type: '手套', name: '缠绕爱恨', require: '颠覆未来之王1星', need: 528, checked: false },
                    { type: '设计师之影', name: '精灵哀歌', require: '颠覆未来之王1星', need: 1500, checked: false },
                    { type: '真我复苏', name: '精灵哀歌', require: '颠覆未来之王1星', need: 750, checked: false },
                    { type: '影之召唤', name: '精灵哀歌', require: '颠覆未来之王1星', need: 750, checked: false, qty: 1 },
                    { type: '连衣裙', name: '梦与蝶之吻', require: '灵感重构大师3星', need: 990, checked: false },
                    { type: '唇妆', name: '轻吟悲歌', require: '灵感重构大师2星', need: 264, checked: false },
                    { type: '鞋子', name: '精灵枷锁', require: '灵感重构大师1星', need: 528, checked: false },
                    { type: '特殊-颈饰', name: '月光束缚', require: '记忆创造者3星', need: 330, checked: false },
                    { type: '底妆', name: '残翼', require: '记忆创造者2星', need: 198, checked: false },
                    { type: '发型', name: '沉默的记忆', require: '记忆创造者1星', need: 528, checked: false },
                    { type: '袜子', name: '岁月纠缠', require: '自由搭配师3星', need: 264, checked: false },
                    { type: '眉妆', name: '清浅伤痕', require: '自由搭配师2星', need: 165, checked: false },
                    { type: '耳饰', name: '精灵之泪', require: '自由搭配师1星', need: 198, checked: false }
                ],
                packageInfo: [ // 礼包信息
                    { name: '稀有钥匙礼包', price: 10, amount: 0, max: 10 },
                    { name: '记忆钥匙-稀有', price: 10, amount: 0, max: 15 },
                    { name: '记忆钥匙-普通', price: 4, amount: 0, max: 50 },
                ],
                itemName: '礼赞之花', // 兑换道具名称
                price: 10, // 购买次数需要消耗的钻石
                free1Day: 5, // 一天的免费次数
                win: 5, // 胜利所得
                lose: 3, // 失败所得
                levelList: [
                    { name: '第1名', num: 600 },
                    { name: '第2名', num: 580 },
                    { name: '第3名', num: 560 },
                    { name: '第4-50名', num: 520 },
                    { name: '第51-100名', num: 480 },
                    { name: '第101-200名', num: 440 },
                    { name: '第201-500名', num: 400 },
                    { name: '第501-1000名', num: 360 },
                    { name: '第1001-2000名', num: 320 },
                    { name: '第2001-3000名', num: 280 },
                    { name: '第3001-5000名', num: 240 },
                    { name: '第5001-10000名', num: 200 },
                    { name: '颠覆未来之王3星', num: 150 },
                    { name: '颠覆未来之王2星', num: 140 },
                    { name: '颠覆未来之王1星', num: 130 },
                    { name: '灵感重构大师3星', num: 120 },
                    { name: '灵感重构大师2星', num: 110 },
                    { name: '灵感重构大师1星', num: 90 },
                    { name: '记忆创造者3星', num: 80 },
                    { name: '记忆创造者2星', num: 70 },
                    { name: '记忆创造者1星', num: 60 },
                    { name: '自由搭配师3星', num: 50 },
                    { name: '自由搭配师2星', num: 40 },
                    { name: '自由搭配师1星', num: 30 },
                    { name: '初心学徒', num: 20 },
                ], // 段位奖励及名称
                topup: [ // 段位升级奖励
                    { name: '永恒的传奇', num: 200, key: 13 },
                    { name: '颠覆未来之王3星', num: 100, key: 12 },
                    { name: '颠覆未来之王2星', num: 100, key: 11 },
                    { name: '颠覆未来之王1星', num: 100, key: 10 },
                    { name: '灵感重构大师3星', num: 80, key: 9 },
                    { name: '灵感重构大师2星', num: 80, key: 8 },
                    { name: '灵感重构大师1星', num: 80, key: 7 },
                    { name: '记忆创造者3星', num: 50, key: 6 },
                    { name: '记忆创造者2星', num: 50, key: 5 },
                    { name: '记忆创造者1星', num: 50, key: 4 },
                    { name: '自由搭配师3星', num: 30, key: 3 },
                    { name: '自由搭配师2星', num: 30, key: 2 },
                    { name: '自由搭配师1星', num: 30, key: 1 },
                    { name: '初心学徒', num: 30, key: 0 },
                ],
                skillLv: [
                    { label: '2级(1个)', value: 1 },
                    { label: '3级(3个)', value: 3 },
                    { label: '4级(6个)', value: 6 },
                    { label: '5级(11个)', value: 11 }
                ], // 影之召唤升级
            },
            // 表单信息
            form: {
                currentAmount: 0, // 当前拥有数量
                finalLevel: 600, // 结算段位
                todayRemain: 0, // 今日剩余免费次数
                todayBuy: 10, // 今日可购买
                winRate: 100, // 胜率
                topupPlan: 13, // 计划最高段位
                currentLevel: 13, // 已达最高段位
            },
            result: {
                time_now: new Date().getTime(),
                time_d: '', // 剩余天数
                time_w: '', // 剩余结算次数
                weeksettle: 0, // 剩余周结算奖励
                totalNeed: 0, // 共需要多少个
                free: 0, // 免费多少个
                freeFight: 0, // 免费挑战奖励
                levelUp: 0, // 段位提升奖励
                remain: 0, // 还差多少个
                needBuy: 0, // 需要购买多少次
                calcres: true, // 能否达到目标
                needPay: 0, // 需要花钻多少
            }
        }
    },
    computed: {
        // 剩余时间，结算次数标题
        getTitle() {
            return `赛季结束时间：${this.dateFormat(this.config.timeEnd)}， 还有${this.result.time_d}天， ${this.result.time_w}次结算`
        },
    },
    created() {
        this.init()
        this.calc()
    },
    methods: {
        // 验证输入
        checkMax(e, val) {
            if (e.target.value >= val) {
                return +val
            } if (e.target.value <= 0) {
                return 0
            } else {
                return +e.target.value
            }
        },
        rowClick(row, e) {
            if (e.target.tagName === 'SPAN') return
            for (let info of this.config.clothesInfo) {
                if (info.type === row.type) {
                    info.checked = !info.checked
                }
            }
            this.calc()
        },
        // 格式化时间
        dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
            if (!date) return '';
            date = new Date(date); // 没有这一步，UTC时间会报错
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) 
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        // 初始化
        init() {
            this.result.time_d = Math.max(0, Math.floor((this.config.timeEnd - this.config.timeNow)/1000/60/60/24));  // 剩余天数
            this.result.time_w = Math.max(0, Math.ceil((this.config.timeEnd - this.config.timeNow)/1000/60/60/24/7)); // 剩余结算次数
        },
        // 计算
        calc() {
            this.result.totalNeed = 0; // 重置
            this.result.levelUp = 0; // 重置段位提升
            this.result.calcres = true;

            this.config.clothesInfo.forEach((item) => {
                // 计算共需多少礼赞之花，选中不参与计算
                if (!item.checked) {
                    if (item.type === '影之召唤') {
                        this.result.totalNeed += Number(item.need) * item.qty; 
                    } else {
                        this.result.totalNeed += Number(item.need); 
                    }
                }
            })
            for (let info of this.config.packageInfo) {
                this.result.totalNeed += info.price * info.amount * this.result.time_w
            }

            // 免费次数=剩余天数*一天的免费次数+今天剩余次数
            let free_time = this.result.time_d * this.config.free1Day + this.form.todayRemain; 

            // 胜利次数=免费次数*胜率/100
            let win_times = Math.floor(free_time * this.form.winRate / 100); 

            // 免费挑战所得=单场胜利所得*胜利次数+单场失败所得*（免费次数-胜利次数）
            this.result.freeFight = this.config.win * win_times + this.config.lose * (free_time - win_times); 

            // 剩余周结算奖励 = 结算段位奖励*结算次数
            this.result.weeksettle = this.form.finalLevel * this.result.time_w;

            this.config.topup.forEach((item) => {
                // 计算段位提升奖励
                if (item.key > this.form.currentLevel && item.key <= this.form.topupPlan) {
                    this.result.levelUp += item.num
                }
            })

            // 剩余免费获得 = 免费挑战获得+周结算+段位提升奖励
            this.result.free = this.result.freeFight + this.result.weeksettle + this.result.levelUp

            // 还差多少 = 共需多少-免费获得-当前
            this.result.remain = Math.max(0, this.result.totalNeed - this.result.free - this.form.currentAmount)

            // 平均单次挑战获得 = 胜利可得*胜率+失败可得*失败几率
            let exp = this.config.win * this.form.winRate / 100 + this.config.lose * (1 - this.form.winRate / 100)

            // 需要购买次数 = 还差多少 / 平均单次可得
            this.result.needBuy = Math.ceil(this.result.remain / exp)
            
            let everyDay = Math.round(Math.max(0, this.result.needBuy - this.form.todayRemain) / this.result.time_d * 10) / 10;
            if (everyDay > 10) {
                this.result.calcres = false;
            }
            this.result.needPay = this.result.needBuy * this.config.price;

        }
    },
}
</script>

<style lang="scss" scoped>

.container {
    width: 500px;
    margin: 0 auto;
    .table {
        margin-bottom: 10px;
        .el-table {
            .cell {
                line-height: 1.15 !important;
            }
        }
    }
    .total {
        height: 28px;
        line-height: 28px;
    }
    .showTime {
        font-size: 12px;
        text-align: center;
    }
    .input {
        .el-row {
            margin-bottom: 10px;
        }
        .el-form-item {
            margin-bottom: 5px !important;
        }
    }
    .weekBuy.input {
        .el-card__body {
            .el-input-group__prepend {
                font-size: 12px !important;
            }
        }
        
        .total {
            font-size: 14px !important;
        }
    }
    .el-card {
        margin-bottom: 10px;  
        .box-item {
            margin-bottom: 8px;
        }
    }
    #calc {
        .box-item {
            font-size: 14px;
        }
        
    }
    
}
.remark {
	font-size:80%;
}

div.title {
	font-size: 140%;
	font-weight : 800;
	color: #1F4499;
	text-align: center;
}

hr.mhr {
	border: 1px dashed #2E9FCC;
}

a {
	text-decoration:none;
	color:#3377ff;
}

@media screen and (max-width: 480px) {
    .container {
        width: 90%;
    }
}
</style>
