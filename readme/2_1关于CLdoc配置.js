const CLdoc =  {
    basic: {
        type: "mongodb数据库类型",       // String Number Date ObjectId
        required: Boolean, // 如果为 true 添加时必须要有此数据 (此字段为 mongoose 自带类型, 写入时 本系统 writePre中 也做了判定 )

        IS_fixed: Boolean, //  字段是否可以修改, 如果为 true  update的时候 前端不能给数据

        AUTO_payload: String, // String 二选一["_id", "Firm"] :自动载入paylaod信息  前端不能提供数据 后端自动设定数据。 
                            // 比如 Order.User_crt = payload._id  Order.Firm = payload.Firm
        AUTO_Date: Boolean, // 是否为自动更新时间， 如果为 true 不需要前端给数据 后端自动生成数据。 
                            // 比如 at_crt 即为 Auto_Date 又为 IS_fixed 所以只有新建时自动添加

        // writePre 中做的判定一下几个参数
        TRIM: Number,        //  (所属字段必须为 String 类型) 字段的固定长度  的正整数
        MIN: Number,        // (所属字段必须为 String 类型) 字段的最小长度  的正整数
        MAX: Number,        //  (所属字段必须为 String 类型) 字段的最大长度  的正整数
        REGEXP: "正则表达式", //  (所属字段必须为 String 类型) 字段要符合的正则表达式

        IS_change: Boolean,     //  保存之前 要更改数据 (如果是需要改变的 则此字段需要在 ${Controller}文件中控制 writePre会根据此字段不判定)

        is_UnReadable: Boolean, // 不可读取此数据 比如 密码  (readPre中 判定此参数)

        unique: Boolean,        // 是否是唯一的, 如果为 true 则本字段中有且只有一个此值 (此字段为 mongoose 自带类型 本系统 在 docSame 中 也做了判定)
        true_unique: Boolean,   // 是否是唯一的, 如果为 true 则本字段中有且只有一个为真
        uniq: ["其他字段"],       // 在docSame文件中做判定
        true_uniq: ["其他字段"],    //    在docSame文件中做判定 比如 true_uniq: ["Firm"] 一个公司中只有一个为真
    }
}

    // uniq: ["其他字段"],    在docSame文件中做判定 比如 uniq: ["Firm"] 一个公司中只有一个此字段的值
    	// 员工编号： {code: "001", Firm: "firmId"} xd公司中是否有 001这个员工编号
    // 想象以下场景:
	// 产品名称： {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
	// 折扣映射： Brand.uniq = ["Supplier"]; 添加折扣文档时 同一个供应商不能有相同的品牌
	// const field = {
	//     // type: ...
	//     // uniq: ['field1', 'field2']
	// }
	// field.uniq = ['field1', 'field2'];
	// 比如：
 	// code: {
	// 	type: String,
	// 	uniq: ['Firm']
	// }