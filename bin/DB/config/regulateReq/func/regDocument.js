/** 
 * 验证前端给的数据是否符合要求， 比如 insert/update时 code的长度及字符是否符合 给了多出的数据库的字段
 * @param {Object} CLobj 数据库模型中字段的对象
 * @param {String} docVal 要写入或修改 到此字段 的值 前端传递的 doc[key]
 * @param {String} key 数据库字段名称
 */
const isErr_docVal = (CLobj, docVal, key) => {
    if (CLobj.type === ObjectId) {
        if (!isObjectIdAbs(docVal)) throw `docRegulate [${key}] 字段的的类型为 ObjectId 您输入的信息有误`;
    } else if (CLobj.type === String) {
        if ((typeof docVal) !== 'string') throw `docRegulate [${key}] 必须为字符串`;
        // docVal = String(docVal);
        if (CLobj.TRIM && CLobj.TRIM !== docVal.length) throw `docRegulate [${key}] 字段的字符串长度必须为 [${CLobj.TRIM}]`;
        if (CLobj.MIN && CLobj.MIN > docVal.length) throw `docRegulate [${key}] 字段的字符串长度为： [${CLobj.MIN} ~ ${CLobj.MAX}]`;
        if (CLobj.MAX && CLobj.MAX < docVal.length) throw `docRegulate [${key}] 字段的字符串长度为： [${CLobj.MIN} ~ ${CLobj.MAX}]`;
        if (CLobj.REGEXP) {
            let REGEXP = new RegExp(CLobj.REGEXP);
            if (!REGEXP.test(docVal)) throw `docRegulate [${key}] 的规则： [${CLobj.regErrMsg}]`;
        }
    } else if (CLobj.type === Number) {
        if (isNaN(docVal)) throw `docRegulate [${key}] 字段为 数字`;;
        docVal = parseInt(docVal);
        if (CLobj.MIN && CLobj.MIN > docVal) throw `docRegulate [${key}] 字段的取值范围为： [${CLobj.MIN}, ${CLobj.MAX}]`;
        if (CLobj.MAX && CLobj.MAX < docVal) throw `docRegulate [${key}] 字段的取值范围为： [${CLobj.MIN}, ${CLobj.MAX}]`;
    } else if (CLobj.type === Date) {

    } else {
        throw "CLobj type 类型错误";
    }
}

const recu = (docObj, CLobj, field, is_upd) => {
    if(field === '_id') return;
    if(!CLobj) throw `regDocumentError ${field} 数据与模型没有对应 1`;
    if (isObject(docObj)) {
        if (!isObject(CLobj)) throw `regDocumentError ${field} 数据与模型没有对应 2。 doc:为对象 CLobj: ${typeof CLobj}`

        for(let key in docObj) {
            recu(docObj[key], CLobj[key], key, is_upd);
        }
    } else if (docObj instanceof Array) {
        if (!(CLobj instanceof Array)) throw `regDocumentError ${field} 数据与模型没有对应 3 doc为数组 但模型不是`
        for (let i = 0; i < docObj.length; i++) {
            recu(docObj[i], CLobj[0], field, is_upd);    // 会自递归自己 判断下一层 （无论下一层是对象还是基础类型 
        }
    } else {

        if (!CLobj.type) throw `regDocumentError ${field} 数据与模型没有对应 4 doc为基本类型 模型还不是`

        /** 修改数据时 不能修改模型中固定的值 */
        if (is_upd && CLobj.IS_fixed) throw `regDocumentError ${field} 不能修改模型中固定的值`;
        /** 前端不可以传递 模型中自动生成的值 */
        if (CLobj.AUTO_payload) throw `regDocumentError ${field} 不能传递模型中自动生成的值`;
        if (CLobj.AUTO_Date) throw `regDocumentError ${field} 不能传递模型中自动生成的值`;

        isErr_docVal(CLobj, docObj, field);
    }
}

/**
 * 
 * @param {*} doc 
 * @param {*} MToptions 
 */
module.exports = (doc, MToptions) => {
    try {
        const { CLdoc, is_upd } = MToptions;
        for(let key in doc) {
            recu(doc[key], CLdoc[key], key, is_upd);
        }
    } catch(e) {
        throw "[regDocument]- "+e
    }
}