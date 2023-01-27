/**
 * 000000 文件不全 应该深入到每一层 自动写入数据 这只做了第一层
 */



/** 
 * 自动给数据库加入 数据 
 * 注意 比如 at_crt / crt_User / Firm 这样的字段 要加上 IS_fixed=ture 这样更新时就不会改变了
 */
const autoWrite = (CLobj, docObj, key, payload) => {
    /** 自动加入 payload _id */
    if (CLobj[key].AUTO_payload === "_id") docObj[key] = payload._id;
    /** 自动加入 payload Firm */
    else if (CLobj[key].AUTO_payload === "Firm") {
        if (payload.Firm) docObj[key] = payload.Firm._id || payload.Firm;
    }
    /** 自动加入 当前时间 */
    else if (CLobj[key].AUTO_Date) docObj[key] = new Date();
}

/**
 * 
 * @param {*} docObj 
 * @param {*} MToptions 
 * @returns 如果没有错误 则没有返回值 有错误 则返回错误 字符串
 */
module.exports = (docObj, MToptions) => {
    let { CLdoc, payload, is_upd = false} = MToptions;
    for (key in CLdoc) {
        if (is_upd) {
            // 在更新的情况下 如果不可更改 则跳过： 比如创建时间 后面的代码就不用执行了
            if (CLdoc[key].IS_fixed) {
                if (docObj[key] !== undefined) return `regulateReq docRegulate 修改时 不可修改 IS_fixed 为true 的字段 [${key}].`;
            } else {
                autoWrite(CLdoc, docObj, key, payload)
            }
        } else {
            // 在新创建数据的情况下 判断每个必须的字段 如果前台没有给赋值 则报错
            if ((CLdoc[key].required === true) && (docObj[key] === null || docObj[key] === undefined)) {
                return `regulateReq docRegulate 创建时 必须添加 [docObj.${key}] 字段`;
            }
            autoWrite(CLdoc, docObj, key, payload)
        }
    }
}