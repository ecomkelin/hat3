/** 
 * 验证前端给的数据是否符合要求， 比如 insert/update时 code的长度及字符是否符合 给了多出的数据库的字段
 * @param {Object} CLobj 数据库模型中字段的对象
 * @param {String} docVal 要写入或修改 到此字段 的值 前端传递的 doc[key]
 * @param {String} key 数据库字段名称
 * @returns [null | String] 如果不为空 则错误
 */
const isErr_docVal = (CLobj, docVal, key) => {
    if (CLobj.type === ObjectId) {
        if (!isObjectIdAbs(docVal)) return `docRegulate [${key}] 字段的的类型为 ObjectId 您输入的信息有误`;
    } else if (CLobj.type === String) {
        if ((typeof docVal) !== 'string') return `docRegulate [${key}] 必须为字符串`;
        // docVal = String(docVal);
        if (CLobj.TRIM && CLobj.TRIM !== docVal.length) return `docRegulate [${key}] 字段的字符串长度必须为 [${CLobj.TRIM}]`;
        if (CLobj.MIN && CLobj.MIN > docVal.length) return `docRegulate [${key}] 字段的字符串长度为： [${CLobj.MIN} ~ ${CLobj.MAX}]`;
        if (CLobj.MAX && CLobj.MAX < docVal.length) return `docRegulate [${key}] 字段的字符串长度为： [${CLobj.MIN} ~ ${CLobj.MAX}]`;
        if (CLobj.REGEXP) {
            let REGEXP = new RegExp(CLobj.REGEXP);
            if (!REGEXP.test(docVal)) return `docRegulate [${key}] 的规则： [${CLobj.regErrMsg}]`;
        }
    } else if (CLobj.type === Number) {
        if (isNaN(docVal)) return `docRegulate [${key}] 字段为 数字`;;
        docVal = parseInt(docVal);
        if (CLobj.MIN && CLobj.MIN > docVal) return `docRegulate [${key}] 字段的取值范围为： [${CLobj.MIN}, ${CLobj.MAX}]`;
        if (CLobj.MAX && CLobj.MAX < docVal) return `docRegulate [${key}] 字段的取值范围为： [${CLobj.MIN}, ${CLobj.MAX}]`;
    } else if (CLobj.type === Date) {

    } else {
        return "CLobj type 类型错误";
    }
}

const recu = (docObj, CLobj, field, is_upd) => {
    if(field === '_id') return;
    if(!CLobj) return `regDocumentError ${field} 数据与模型没有对应 1`;
    if (isObject(docObj)) {
        if (!isObject(CLobj)) return `regDocumentError ${field} 数据与模型没有对应 2。 doc:为对象 CLobj: ${typeof CLobj}`

        for(let key in docObj) {
            let errMsg = recu(docObj[key], CLobj[key], key, is_upd);
            if (errMsg) return errMsg;
        }
    } else if (docObj instanceof Array) {
        if (!(CLobj instanceof Array)) return `regDocumentError ${field} 数据与模型没有对应 3 doc为数组 但模型不是`
        for (let i = 0; i < docObj.length; i++) {
            let errMsg = recu(docObj[i], CLobj[0], field, is_upd);    // 会自递归自己 判断下一层 （无论下一层是对象还是基础类型 
            if (errMsg) return errMsg;
        }
    } else {

        if (!CLobj.type) return `regDocumentError ${field} 数据与模型没有对应 4 doc为基本类型 模型还不是`

        /** 修改数据时 不能修改模型中固定的值 */
        if (is_upd && CLobj.IS_fixed) return `regDocumentError ${field} 不能修改模型中固定的值`;
        /** 前端不可以传递 模型中自动生成的值 */
        if (CLobj.AUTO_payload) return `regDocumentError ${field} 不能传递模型中自动生成的值`;
        if (CLobj.AUTO_Date) return `regDocumentError ${field} 不能传递模型中自动生成的值`;

        let errMsg = isErr_docVal(CLobj, docObj, field);
        if (errMsg) return errMsg;
    }
}

/**
 * 
 * @param {*} doc 
 * @param {*} MToptions 
 * @returns 如果没有错误 则没有返回值 有错误 则返回错误 字符串
 */
module.exports = (doc, MToptions) => {
    const { CLdoc, is_upd } = MToptions;
    for(let key in doc) {
        let errMsg = recu(doc[key], CLdoc[key], key, is_upd);
        if (errMsg) return errMsg;
    }
}