/** 
 * 验证前端给的数据是否符合要求， 比如 insert/update时 code的长度及字符是否符合 给了多出的数据库的字段
 * @param {Object} CLobj 数据库模型中字段的对象
 * @param {String} docObj 要写入或修改 到此字段 的值 前端传递的 doc[key]
 * @param {String} field 数据库字段名称 为了传递要修改的值 所以要传递 docObj对象 而不是 docVal值
 */
const isErr_docObj = (CLobj, docObj, field, index) => {
    let _docObj = null;
    let _CLobj = null;
    if (isNaN(index)) {
        _docObj = docObj[field];
        _CLobj = CLobj[field];
    } else {
        console.log("Array")
        index = parseInt(index);
        _docObj = docObj[field][index];
        _CLobj = CLobj[field][0];
    }

    if (_CLobj.type === ObjectId) {
        if (!isObjectIdAbs(_docObj)) throw `docRegulate [${field}] 字段的的类型为 ObjectId 您输入的信息有误`;
    } else if (_CLobj.type === String) {
        if ((typeof _docObj) !== 'string') throw `docRegulate [${field}] 必须为字符串`;

        // if(isNaN(index)) docObj[field] = String(_docObj);
        // else docObj[field][index] = String(_docObj);

        if (_CLobj.TRIM && _CLobj.TRIM !== _docObj.length) throw `docRegulate [${field}] 字段的字符串长度必须为 [${_CLobj.TRIM}]`;
        if (_CLobj.MIN && _CLobj.MIN > _docObj.length) throw `docRegulate [${field}] 字段的字符串长度为： [${_CLobj.MIN} ~ ${_CLobj.MAX}]`;
        if (_CLobj.MAX && _CLobj.MAX < _docObj.length) throw `docRegulate [${field}] 字段的字符串长度为： [${_CLobj.MIN} ~ ${_CLobj.MAX}]`;
        if (_CLobj.REGEXP) {
            let REGEXP = new RegExp(_CLobj.REGEXP);
            if (!REGEXP.test(_docObj)) throw `docRegulate [${field}] 的规则： [${_CLobj.regErrMsg}]`;
        }
    } else if (_CLobj.type === Number) {
        if (isNaN(_docObj)) throw `docRegulate [${field}] 字段为 数字`;;

        if (isNaN(index)) docObj[field] = parseInt(_docObj);
        else docObj[field][index] = parseInt(_docObj);

        if (_CLobj.MIN && _CLobj.MIN > _docObj) throw `docRegulate [${field}] 字段的取值范围为： [${_CLobj.MIN}, ${_CLobj.MAX}]`;
        if (_CLobj.MAX && _CLobj.MAX < _docObj) throw `docRegulate [${field}] 字段的取值范围为： [${_CLobj.MIN}, ${_CLobj.MAX}]`;
    } else if (_CLobj.type === Date) {

    } else if (_CLobj.type === Boolean) {
        
    } else if(!_CLobj.type) {
        throw "CLobj[field] type 类型错误";
    }
}

const recu = (docObj, CLobj, field, is_upd, index) => {
    if (field === '_id') return;
    let _docObj = null;
    let _CLobj = null;
    if (isNaN(index)) {
        _docObj = docObj[field];
        _CLobj = CLobj[field];
    } else {
        index = parseInt(index);
        _docObj = docObj[field][index];
        _CLobj = CLobj[field][0];
    }

    if (!_CLobj) throw ` ${field} 数据与模型没有对应 #1`;
    if (isObject(_docObj)) {
        if (!isObject(_CLobj)) throw ` ${field} 数据与模型没有对应 #2。 doc:为对象 _CLobj: ${typeof _CLobj}`

        if(!_docObj._id) _docObj._id = newObjectId();

        for (let key in _docObj) {
            recu(_docObj, _CLobj, key, is_upd);
        }

    } else if (_docObj instanceof Array) {

        if (!(_CLobj instanceof Array)) throw ` ${field} 数据与模型没有对应 #3 doc为数组 但模型不是`
        for (let i = 0; i < _docObj.length; i++) {
            recu(docObj, CLobj, field, is_upd, i);    // 会自递归自己 判断下一层 （无论下一层是对象还是基础类型 
        }
    } else {

        if (!_CLobj.type) throw ` ${field} 数据与模型没有对应 #4 doc为基本类型 模型还不是`

        /** 修改数据时 不能修改模型中固定的值 */
        if (is_upd && _CLobj.IS_fixed) throw ` ${field} 不能修改模型中固定的值`;
        /** 前端不可以传递 模型中自动生成的值 */
        if (_CLobj.AUTO_payload) throw ` ${field} 不能传递模型中自动生成的值`;
        if (_CLobj.AUTO_Date) throw ` ${field} 不能传递模型中自动生成的值`;

        isErr_docObj(CLobj, docObj, field, index);
    }
}

/**
 * @param {*} doc 
 * @param {*} MToptions 
 */
module.exports = (doc, MToptions) => {
    try {
        const { CLdoc = {}, is_upd } = MToptions;

        for (let key in doc) {
            recu(doc, CLdoc, key, is_upd);
        }
    } catch (e) {
        throw "[regDocument]- " + e
    }
}