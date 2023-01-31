/**
 * 过滤 reqBody 中的 update 对象
 */
const regDocument = require("../func/regDocument");
const regCLobj = require("../func/regCLobj");

const upd_keys = ["$set", "$mul", "$inc"]    // 暂时用这三个
// const upd_keys = ["$set", "$unset", "$mul", "$inc", "$rename"]
module.exports = (ctxObj, MToptions) => {
    const { update = {} } = ctxObj.reqBody;
    const {payload} = ctxObj.Koptions;
    const {CLdoc} = MToptions;

    if (!isObject(update)) return "regulateReq update 中的 update 要为对象"
    let errMsg = null;

    MToptions.is_upd = true;

    const updMethods = Object.keys(update);

    for (let i in updMethods) {
        const updMethod = updMethods[i];
        if(!upd_keys.includes(updMethod)) return `update["$set", "$mul", "$inc"] 暂时只有这三个值 不能是 updMethod`;
        let is_set = (updMethod === "$set") ? true: false;

        let doc = update[updMethod];

        if(is_set) {
            /** 根据 doc数据 判断是否正确 */
            errMsg = regDocument(doc, MToptions);
            if (errMsg) return errMsg;
        
            /** 根据数据模型 判断数据是否正确 */
            // 在更新的情况下 如果不可更改 则跳过： 比如创建时间 后面的代码就不用执行了
    
            for(let key in CLdoc) {
                if (CLdoc[key].IS_fixed) {
                    if (doc[key] !== undefined) return `update 修改时 不可修改 IS_fixed 为true 的字段 [${key}].`;
                } else {
                    let errMsg = regCLobj(CLdoc, doc, key, payload)
                    if(errMsg) return errMsg;
                }
            }
        } else {
            for(let key in doc) {
                if(isNaN(doc[key])) return "update[inc/mul] 的值 只能为数字"
            }
        }
    }

    return null;
};