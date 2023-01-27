const regDocument = require("./method/regDocument");
const regCLdoc = require("./method/regCLdoc");

const upd_keys = ["$set", "$mul", "$inc"]
// const upd_keys = ["$set", "$unset", "$mul", "$inc", "$rename"]
module.exports = (req, MToptions) => {
    const { update = {} } = req;
    if (!isObject(update)) return "reqRegulate update 中的 update 要为对象"
    let errMsg = null;

    let keys = Object.keys(update);
    let hasMethod = [0, 0];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key[0] === "$" && !upd_keys.includes(key)) return `reqRegulate update 暂不支持此 ${key} 更新方式`
        if (upd_keys.includes[key]) {
            hasMethod[0] = 1;   // 如果是 update 方法 则为1
        } else {
            hasMethod[1] = 1;   // 如果不是update的方法 则为1
        }
        if (hasMethod[0] + hasMethod[1] === 2) return "reqRegulate update 请写入正确的 update 的更新方式"
    }
    /** 如果前端没有给update方法 则默认 update对象为 update的set方法 */
    if (hasMethod[1] === 0) update["$set"] = update;

    let options = {
        is_upd: true,
        ...MToptions
    }
    keys = Object.keys(update);
    for (let i = 0; i < keys.length; i++) {
        let doc = update[keys[i]]
        /** 根据 doc数据 判断是否正确 */
        errMsg = regDocument(doc, options);
        if (errMsg) return errMsg;
    
        /** 根据数据模型 判断数据是否正确 */
        errMsg = regCLdoc(doc, options);
        if (errMsg) return errMsg;
    }

    return null;
};