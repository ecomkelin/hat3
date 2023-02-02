/** 没有直接使用 constance.env 中的 Object 原因是 防止此文件先加载
 * 也可以直接在这把 ObjectId 放到global 但是这不太符合方法
 */
const { ObjectId } = require("mongodb");    


isObjectId = id => ObjectId.isValid(id);
isObjectIdAbs = id => ObjectId.isValid(id) ? (typeof id) !== 'string' : false;

newObjectId = id => (!isObjectIdAbs(id) && isObjectId(id)) ? new ObjectId(id) : id;

isObject = obj => {
    if(isObjectId(obj)) return false;
    if(obj instanceof Array) return false;
    return (Object.prototype.toString.call(obj) === '[object Object]') ? true: false;
}