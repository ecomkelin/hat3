/** 销售单 Sales Order： 线上订单 */

const DB = require("../../../bin/DB");
const CLname = "Os_online";

const CLdoc = {
    code: {type: String},

    source: String,   // 线上订单的来源 ios 安卓 小程序 h5 或 哪个第三方

    Client: {type: ObjectId, ref: "Client"},    // 用户

    step: {type: Number},						// enum: ConfOrder;

    itemSkus: [{
        page: String,   // 从哪个入口添加到购物车的 首页 / 活动页 / 列表页 / 搜索页 / 相关产品 / 个人中心推荐页 / 购物车推荐页   方便营销

        Sku_id: {type: Number},

        code: String,
        name: String,
        unit: String,
        price_regular: {type: Number},  // 产品标价
        price_sale: {type: Number},     // 产品折扣价

        qty: {type: Number}
    }],
    goods_info: {
        weight: Number,   // 单位 g
        amount: Number, // 货物总数量
    },
    goods_regular: {type: Number},    // 货物原价
    goods_sale: {type: Number},    // 货物打折价

    itemCupons: [{    
        Cupon_id: {type: Number},        
        nameCupon: {type: String},
        price: {type: Number},
    }],
    
    order_regular: {type: Number},
    order_price: {type: Number}, // = goods_sale - for(itemCupons.price)

    freight_info: {
        city: String,
        addr: String,
        bell: String,   // 门铃
        tel: String,    // 电话
        note: String,
    },
    freight_price: Number,

    imp: Number,    // 付款金额

	paid_info: {
        paidType: String,   // 微信支付 paple stripe

        paypal_orderId: String, // paypal 系统检测
	},

    at_crt: Date,
    at_pay: Date,

    User_res: {type: ObjectId, ref: "User"},

    User_freight: {type: ObjectId, ref: "User"},
    at_freight: Date,

    at_finish: Date,

    Shop: {type: ObjectId, ref: "Shop"}
}


module.exports = DB(CLname, CLdoc);