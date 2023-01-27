/** 
 * 验证前端给的数据是否符合要求， 比如 insert/update时 code的长度及字符是否符合 给了多出的数据库的字段
 * @param {Object} CLobj 数据库模型中字段的对象
 * @param {String} docVal 要写入或修改 到此字段 的值 前端传递的 doc[key]
 * @param {String} key 数据库字段名称
 * @returns [null | String] 如果不为空 则错误
 */
const isErr_docVal = (CLobj, docVal, key) => {
    console.log(1111, CLobj)
    if (CLobj.type === ObjectId) {
        if (!isObjectIdAbs(docVal)) return `regulateReq docRegulate [${key}] 字段的的类型为 ObjectId 您输入的信息有误`;
    } else if (CLobj.type === String) {
        if ((typeof docVal) !== 'string') return `regulateReq docRegulate [${key}] 必须为字符串`;
        // docVal = String(docVal);
        if (CLobj.TRIM && CLobj.TRIM !== docVal.length) return `regulateReq docRegulate [${key}] 字段的字符串长度必须为 [${CLobj.TRIM}]`;
        if (CLobj.MIN && CLobj.MIN > docVal.length) return `regulateReq docRegulate [${key}] 字段的字符串长度为： [${CLobj.MIN} ~ ${CLobj.MAX}]`;
        if (CLobj.MAX && CLobj.MAX < docVal.length) return `regulateReq docRegulate [${key}] 字段的字符串长度为： [${CLobj.MIN} ~ ${CLobj.MAX}]`;
        if (CLobj.REGEXP) {
            let REGEXP = new RegExp(CLobj.REGEXP);
            if (!REGEXP.test(docVal)) return `regulateReq docRegulate [${key}] 的规则： [${CLobj.regErrMsg}]`;
        }
    } else if (CLobj.type === Number) {
        if (isNaN(docVal)) return `regulateReq docRegulate [${key}] 字段为 数字`;;
        docVal = parseInt(docVal);
        if (CLobj.minNum && CLobj.minNum > docVal) return `regulateReq docRegulate [${key}] 字段的取值范围为： [${CLobj.minNum}, ${CLobj.maxNum}]`;
        if (CLobj.maxNum && CLobj.maxNum < docVal) return `regulateReq docRegulate [${key}] 字段的取值范围为： [${CLobj.minNum}, ${CLobj.maxNum}]`;
    } else if (CLobj.type === Date) {

    } else {
        return "CLobj type 类型错误";
    }
}
const fromDocVal = (docVal, CLobj, is_upd) => {
    if(isObject(docVal)) {
        if(!isObject(CLobj)) return "regulateReq docRegulate fromDocVal CLobj 不为对象 但是 docVal 为对象 所以错误"
        let errMsg = fromDoc(docVal, CLobj, is_upd);
        if(errMsg) return errMsg;
    } else if(docVal instanceof Array) {
        if(!(CLobj instanceof Array)) return "regulateReq docRegulate fromDocVal CLobj 不为数组 但是 docVal 为数组 所以错误"
        for(let i=0; i<docVal.length; i++) {
            let errMsg = fromDocVal(docVal[i], CLobj[0], is_upd);
            if(errMsg) return errMsg;
        }
    } else {
        if(!CLobj.type) return "regulateReq docRegulate fromDocVal docVal 是基础值的情况下 CL_field无type"

        /** 修改数据时 不能修改模型中固定的值 */
        if (is_upd && CLobj.IS_fixed) return `regulateReq docRegulate [${key}]为不可修改数据`;
        /** 前端不可以传递 模型中自动生成的值 */
        if (CLobj.AUTO_payload) return `regulateReq docRegulate [${key}]为自动生成的数据`;
        if (CLobj.AUTO_Date) return `regulateReq docRegulate [${key}]为自动生成的数据`;

        let errMsg = isErr_docVal(CLobj, docVal, key);
        if (errMsg) return errMsg;
    }
}

const fromDoc = (docObj, CLobj, is_upd) => {
    if (!isObject(docObj)) return "regulateReq docRegulate fromDoc docObj 只能是 对象 或 数组";
    
    for (key in docObj) {
        if (!CLobj[key]) return `regulateReq docRegulate [${key}]数据模型中没有此值`;

        let errMsg = fromDocVal(docObj[key], CLobj[key], is_upd);
        if(errMsg) return errMsg;
    }
}

/**
 * 
 * @param {*} doc 
 * @param {*} MToptions 
 * @returns 如果没有错误 则没有返回值 有错误 则返回错误 字符串
 */
module.exports = (doc, MToptions) => {
    const {CLdoc, is_upd} = MToptions;

    let errMsg = fromDoc(doc, CLdoc, is_upd);
    if(errMsg) return errMsg;
}