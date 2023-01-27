const { ObjectId } = require("mongodb");


isObjectId = id => ObjectId.isValid(id);
isObjectIdAbs = id => ObjectId.isValid(id) ? (typeof id) !== 'string' : false;

newObjectId = id => (!isObjectIdAbs(id) && isObjectId(id)) ? new ObjectId(id) : id;

isObject = obj => {
    if(isObjectId(obj)) return false;
    if(obj instanceof Array) return false;
    return (Object.prototype.toString.call(obj) === '[object Object]') ? true: false;
}