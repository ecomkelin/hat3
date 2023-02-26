/** 
 * 自动给数据库加入 数据 
 * 注意 比如 at_crt / crt_User / Firm 这样的字段 要加上 IS_fixed=ture 这样更新时就不会改变了
 */
const regCLobj = (CLobj, docObj, key, payload) => {
    /** auto 后台自动添加的数据 */
    /** 自动加入 payload _id */
    if (CLobj[key].AUTO_payload === "_id") {
        if (payload._id) docObj[key] = payload._id;
    }
    /** 自动加入 payload Firm 999999 暂时不用 */
    else if (CLobj[key].AUTO_payload === "Firm") {
        if (payload.Firm) docObj[key] = payload.Firm;
    }
    /** 自动加入 当前时间 */
    else if (CLobj[key].AUTO_Date) docObj[key] = new Date();

    else if (CLobj[key].AUTO) delete docObj[key];

    /** 字段写入是否符合 CONF 配置 */
    if (CLobj[key].CONF && docObj[key]) {
        if (!CLobj[key].CONF.vals.includes(docObj[key])) throw `regCLobj ${key} 字段值为 ${docObj[key]}, 不符合[${CLobj[key].CONF.vals}]文档的配置信息 `
    }
}
const recu = (CLdoc, doc, MToptions, n) => {
    const { payload = {}, is_upd = false } = MToptions;
    if(!doc) {
        if(n === 0) throw `doc 错误`;
        return;
    }
    n++;

    if(CLdoc.type) return;
    for (let key in CLdoc) {
        const CLobj = CLdoc[key];
        if (CLobj.type) {
            if (is_upd) {
                if (CLobj.IS_fixed) {
                    if (doc[key] !== undefined) throw `update 修改时 不可修改 IS_fixed 为true 的字段 [${key}].`;
                } else {
                    regCLobj(CLdoc, doc, key, payload)
                }
            } else {
                if (CLobj.default || CLobj.default === 0 || CLobj.default === false) {
                    if (!doc[key] && doc[key] !== 0 && doc[key] !== false) doc[key] = CLobj.default;
                } if ((CLobj.required === true) && (doc[key] === null || doc[key] === undefined)) {
                    throw `docRegulate 创建时 必须添加 [doc.${key}] 字段`;
                }
                regCLobj(CLdoc, doc, key, payload)
            }
        } else {
            if (isObject(CLobj)) {
                if (!isObject(doc[key])) doc[key] = {};
                recu(CLobj, doc[key], MToptions, n);
            } else if (CLobj instanceof Array) {
                /** 00000 这里会出现一个问题 如果没有更新这个字段 也会出现这个字段变为 空数组
                 * 解决办法1 在update那块再删除 暂时用这个
                 * 解决办法2 只要没有 doc[key] 则跳过此判断 缺点 无法判断 [ 里面的 Auto requied default ]
                 * 如果有更好的方法
                 */
                if (!(doc[key] instanceof Array)) doc[key] = [];
                for (let i in CLobj) {
                    recu(CLobj[0], doc[key][i], MToptions, n)
                }
            } else {
                throw "CLdoc 错误"
            }
        }
    }
}

module.exports = (CLdoc, doc, MToptions) => {
    try {
        recu(CLdoc, doc, MToptions, 0)
    } catch(e) {
        console.log(111, e)
        throw "[regCLdoc]- "+e
    }
}