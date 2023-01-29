/**
 * 000000 文件不全 应该深入到每一层 自动写入数据 这只做了第一层
 */



/** 
 * 自动给数据库加入 数据 
 * 注意 比如 at_crt / crt_User / Firm 这样的字段 要加上 IS_fixed=ture 这样更新时就不会改变了
 */
let now = new Date();
const followCLobj = (CLobj, docObj, key, payload) => {

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
        if(!CLobj[key].CONF.vals.includes(docObj[key])) return `regulateReq followCLobj ${key} 字段值为 ${docObj[key]}, 不符合[${CLobj[key].CONF.vals}]文档的配置信息 `
    }
}

/**
 * 
 * @param {*} docObj 
 * @param {*} Koptions 
 * @returns 如果没有错误 则没有返回值 有错误 则返回错误 字符串
 */
module.exports = (docObj, Koptions) => {
    let { CLdoc, payload, is_upd = false} = Koptions;
    now = new Date();
    for (key in CLdoc) {
        if (is_upd) {
            // 在更新的情况下 如果不可更改 则跳过： 比如创建时间 后面的代码就不用执行了
            if (CLdoc[key].IS_fixed) {
                if (docObj[key] !== undefined) return `regulateReq docRegulate 修改时 不可修改 IS_fixed 为true 的字段 [${key}].`;
            } else {
                let errMsg = followCLobj(CLdoc, docObj, key, payload)
                if(errMsg) return errMsg;
            }
        } else {
            // 在新创建数据的情况下 判断每个必须的字段 如果前台没有给赋值 则报错
            if ((CLdoc[key].required === true) && (docObj[key] === null || docObj[key] === undefined)) {
                return `regulateReq docRegulate 创建时 必须添加 [docObj.${key}] 字段`;
            }
            let errMsg = followCLobj(CLdoc, docObj, key, payload)
            if(errMsg) return errMsg;
        }
    }
}