/** 
 * 验证前端给的数据是否符合要求， 比如 insert/update时 code的长度及字符是否符合 给了多出的数据库的字段
 * @param {Object} CLobj 数据库模型中字段的对象
 * @param {String} docVal 要写入或修改 到此字段 的值 前端传递的 doc[key]
 * @param {String} key 数据库字段名称
 */
const isErr_docVal = (CLobj, docVal, key) => {
    if (CLobj[key].type === ObjectId) {
        if (!isObjectIdAbs(docVal[key])) throw `docRegulate [${key}] 字段的的类型为 ObjectId 您输入的信息有误`;
    } else if (CLobj[key].type === String) {
        if ((typeof docVal[key]) !== 'string') throw `docRegulate [${key}] 必须为字符串`;
        // docVal[key] = String(docVal[key]);
        if (CLobj[key].TRIM && CLobj[key].TRIM !== docVal[key].length) throw `docRegulate [${key}] 字段的字符串长度必须为 [${CLobj[key].TRIM}]`;
        if (CLobj[key].MIN && CLobj[key].MIN > docVal[key].length) throw `docRegulate [${key}] 字段的字符串长度为： [${CLobj[key].MIN} ~ ${CLobj[key].MAX}]`;
        if (CLobj[key].MAX && CLobj[key].MAX < docVal[key].length) throw `docRegulate [${key}] 字段的字符串长度为： [${CLobj[key].MIN} ~ ${CLobj[key].MAX}]`;
        if (CLobj[key].REGEXP) {
            let REGEXP = new RegExp(CLobj[key].REGEXP);
            if (!REGEXP.test(docVal[key])) throw `docRegulate [${key}] 的规则： [${CLobj[key].regErrMsg}]`;
        }
    } else if (CLobj[key].type === Number) {
        if (isNaN(docVal[key])) throw `docRegulate [${key}] 字段为 数字`;;
        docVal[key] = parseInt(docVal[key]);
        if (CLobj[key].MIN && CLobj[key].MIN > docVal[key]) throw `docRegulate [${key}] 字段的取值范围为： [${CLobj[key].MIN}, ${CLobj[key].MAX}]`;
        if (CLobj[key].MAX && CLobj[key].MAX < docVal[key]) throw `docRegulate [${key}] 字段的取值范围为： [${CLobj[key].MIN}, ${CLobj[key].MAX}]`;
    } else if (CLobj[key].type === Date) {

    } else {
        throw "CLobj[key] type 类型错误";
    }
}

const recu = (docObj, CLobj, field, is_upd) => {
    if(field === '_id') return;
    if(!CLobj[field]) throw ` ${field} 数据与模型没有对应 1`;
    if (isObject(docObj[field])) {
        if (!isObject(CLobj[field])) throw ` ${field} 数据与模型没有对应 2。 doc:为对象 CLobj[field]: ${typeof CLobj[field]}`

        for(let key in docObj[field]) {
            recu(docObj[field][key], CLobj[field][key], key, is_upd);
        }
    } else if (docObj[field] instanceof Array) {
        if (!(CLobj[field] instanceof Array)) throw ` ${field} 数据与模型没有对应 3 doc为数组 但模型不是`
        for (let i = 0; i < docObj[field].length; i++) {
            recu(docObj[field][i], CLobj[field][0], field, is_upd);    // 会自递归自己 判断下一层 （无论下一层是对象还是基础类型 
        }
    } else {

        if (!CLobj[field].type) throw ` ${field} 数据与模型没有对应 4 doc为基本类型 模型还不是`

        /** 修改数据时 不能修改模型中固定的值 */
        if (is_upd && CLobj[field].IS_fixed) throw ` ${field} 不能修改模型中固定的值`;
        /** 前端不可以传递 模型中自动生成的值 */
        if (CLobj[field].AUTO_payload) throw ` ${field} 不能传递模型中自动生成的值`;
        if (CLobj[field].AUTO_Date) throw ` ${field} 不能传递模型中自动生成的值`;

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
        const { CLdoc={}, is_upd } = MToptions;
        for(let key in doc) {
            recu(doc, CLdoc, key, is_upd);
        }
    } catch(e) {
        throw "[regDocument]- "+e
    }
}