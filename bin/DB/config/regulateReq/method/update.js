/**
 * 过滤 reqBody 中的 update 对象
 */
const regDocument = require("../func/regDocument");
const regCLdoc = require("../func/regCLdoc");

const upd_keys = ["$set", "$mul", "$inc"]
// const upd_keys = ["$set", "$unset", "$mul", "$inc", "$rename"]
module.exports = (ctxObj, MToptions) => {
    const { update = {} } = ctxObj.reqBody;
    const {payload} = ctxObj.Koptions;

    if (!isObject(update)) return "regulateReq update 中的 update 要为对象"
    let errMsg = null;

    MToptions.is_upd = true;

    keys = Object.keys(update);

    for (let i = 0; i < keys.length; i++) {
        let doc = update[keys[i]]

        /** 根据 doc数据 判断是否正确 */
        errMsg = regDocument(doc, MToptions);
        if (errMsg) return errMsg;
    
        /** 根据数据模型 判断数据是否正确 */
        errMsg = regCLdoc(doc, MToptions, payload);
        if (errMsg) return errMsg;
    }

    return null;
};