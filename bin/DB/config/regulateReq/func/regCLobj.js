/** 
 * 自动给数据库加入 数据 
 * 注意 比如 at_crt / crt_User / Firm 这样的字段 要加上 IS_fixed=ture 这样更新时就不会改变了
 */
module.exports = (CLobj, docObj, key, payload) => {
    /** auto 后台自动添加的数据 */
    /** 自动加入 payload _id */
    if (CLobj[key].AUTO_payload === "_id") docObj[key] = payload._id;
    /** 自动加入 payload Firm */
    else if (CLobj[key].AUTO_payload === "Firm") {
        if (payload.Firm) docObj[key] = payload.Firm;
    }
    /** 自动加入 当前时间 */
    else if (CLobj[key].AUTO_Date) docObj[key] = new Date();

    /** 字段写入是否符合 CONF 配置 */
    if(CLobj[key].CONF && docObj[key]) {
        if(!CLobj[key].CONF.vals.includes(docObj[key])) return `regCLobj ${key} 字段值为 ${docObj[key]}, 不符合[${CLobj[key].CONF.vals}]文档的配置信息 `
    }
}
