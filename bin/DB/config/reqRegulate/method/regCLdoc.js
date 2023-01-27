/** 自动给数据库加入 数据 */
const autoWrite = (CLobj, docObj, key, payload) => {
    if (CLobj[key].payload_insert === "_id") {
        /** 自动加入 payload _id */
        docObj[key] = payload._id;
    } else if (CLobj[key].payload_insert === "Firm") {
        /** 自动加入 payload Firm */
        if (payload.Firm) docObj[key] = payload.Firm._id || payload.Firm;
    }
    /** 自动加入 当前时间 */
    if (CLobj[key].Date_insert) docObj[key] = new Date();      // 自动计时
}

module.exports = (docObj, MToptions) => {
    let { CLobj, payload, is_upd = false} = MToptions;
    for (key in CLobj) {
        if (is_upd) {
            // 在更新的情况下 如果不可更改 则跳过： 比如创建时间 后面的代码就不用执行了
            if (CLobj[key].IS_fixed) {
                if (docObj[key] !== undefined) return `reqRegulate docRegulate 修改时 不可修改 IS_fixed 为true 的字段 [${key}].`;
            } else {
                autoWrite(CLobj, docObj, key, payload)
            }
        } else {
            // 在新创建数据的情况下 判断每个必须的字段 如果前台没有给赋值 则报错
            if ((CLobj[key].required === true) && (docObj[key] === null || docObj[key] === undefined)) {
                return `reqRegulate docRegulate 创建时 必须添加 [docObj.${key}] 字段`;
            }
            autoWrite(CLobj, docObj, key, payload)
        }
    }
    return null;
}