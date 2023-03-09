/** 销售单 Order online： 线上订单 */

const DB = require("../../../bin/DB");
const CLname = "Order";

const CLdoc = {
    code: {type: String},

    source: String,   // 线上订单的来源 ios 安卓 小程序 h5 或 哪个第三方

    Client: {type: ObjectId, ref: "Client"},    // 用户

    step: {type: Number},						// enum: ConfOrder;

    lines: [{
        // page: String,   // 从哪个入口添加到购物车的 首页 / 活动页 / 列表页 / 搜索页 / 相关产品 / 个人中心推荐页 / 购物车推荐页   方便营销

        Pd: {type: ObjectId, ref: "Pd"},
        Sku: {type: ObjectId, ref: "Sku"},

        code: String,
        img: String,
        name: String,
        // unit: String,
        price_retail: {type: Number},  // 产品标价
        price_sale: {type: Number},     // 产品折扣价
        qty: {type: Number}
    }],
    // goods_info: {
    //     weight: Number,   // 单位 g
    //     amount: Number, // 货物总数量
    // },
    goods_retail: {type: Number},    // 货物原价
    goods_sale: {type: Number},    // 货物打折价
    at_crt: {type: Date},

    // itemCupons: [{    
    //     Cupon_id: {type: Number},        
    //     nameCupon: {type: String},
    //     price: {type: Number},
    // }],
    // order_retail: {type: Number},
    // order_price: {type: Number}, // = goods_sale - for(itemCupons.price)

    freight_info: {
        city: {type: String},
        addr: {type: String},
        name: {type: String},
        tel: {type: String},
        bell: {type: String},   // 门铃
        note: {type: String},   // 备注
    },
    freight_price: Number,

    imp: Number,    // 付款金额

	paid_info: {
        paidType: String,   // 微信支付 paple stripe
        paypal_orderId: String, // paypal 系统检测
	},
    at_pay: {type: Date},

    User_res: {type: ObjectId, ref: "User"},        // 订单接收人员
    User_freight: {type: ObjectId, ref: "User"},    // 送货员
    at_freight: {type: Date},                       // 发货时间


    at_finish: {type: Date},
}

const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {

        },
        findOne: {

        },
        updateOne: {
            roles: role_pder,
        },
        updateMany: {
            roles: role_pder,
        },
        deleteOne: {
            roles: role_pder,
        },

        deleteMany: {
            roles: role_pder,
        },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);