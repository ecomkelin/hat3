/**
 * 获取 doc模型中 field 对象
 * @param {Object} CLdoc required, 
 * @param {String} field required, 
 * @returns [Object] 如果返回的对象中 有errMsg属性 那么就说明是错误的
 */
module.exports = (CLdoc, field) => {
    if(!CLdoc) return {errMsg: " obt_CLfield 中的 doc不能为空"};   // 如果没有doc则返回空
    if(!field) return {errMsg: " obt_fieldFieldObj 中的 field不能为空"};   // 如果没有doc则返回空

    if(field === "_id") return {type: ObjectId};  // 如果 field 是 _id 则返回 ObjectId类型

    if(CLdoc[field]) {
        if(CLdoc[field].type) return CLdoc[field];   // 如果存在此 filed 直接返回
        if(CLdoc[field] instanceof Array && CLdoc[field][0].type) return CLdoc[field][0];
        return "没有此 模型"
    }

    /** field 中有可能包含点('.')  */
    let keys = field.split('.');
    /** 如果 field 不包含点('.') 已经判定无此字段 */
    if(keys.length < 2) return {errMsg: `doc中 无此字段1 [${field}]`}; 

    /** 000000 有可能为多级对象 我只写了 一级和二级  */
    let [key1, key2] = keys;
    if(!CLdoc[key1]) return {errMsg: `doc中 无此字段2 [${field}]`}; // 如果第一层没有 则返回空
    let CLdocObj = CLdoc[key1];
    if(CLdocObj instanceof Object) { // 判断 CLdoc[key1]是否为对象 如果不为对象则跳过 返回空
        let CLobj = (CLdocObj instanceof Array) ? CLdocObj[0][key2] : CLdocObj[key2]; // 判断doc[key1]是否为数组 获取下一层
        if(CLobj) return CLobj;
        return {errMsg: `CLdoc[${key1}] 中没有 ${key2} 这个对象`}
    };
    return {errMsg: `CLdoc[${key1}] 不是对象`};  // 如果 CLdoc[key1] 不是对象 则错误
}