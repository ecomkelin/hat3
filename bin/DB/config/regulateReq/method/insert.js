const regDocument = require("../func/regDocument");
const regCLobj = require("../func/regCLobj");

module.exports = (ctxObj, MToptions) => {
    const {document, documents} = ctxObj.reqBody;
    const {payload} = ctxObj.Koptions;
    const {CLdoc} = MToptions;
    let docs = [];
    if(document) docs.push(document);
    else if(documents) docs = documents;

    for(let i in docs) {
        let doc = docs[i];
        /** 下面两个函数 不能改变顺序 因为先判断前端给的数据是否符合要求 再自动生成 */
        /** 根据 doc数据 判断是否正确 */
        let errMsg = regDocument(doc, MToptions);
        if (errMsg) return errMsg;
        
        /** 根据数据模型 判断数据是否正确 */
        // 在新创建数据的情况下 判断每个必须的字段 如果前台没有给赋值 则报错
        for(let key in CLdoc) {
            if(CLdoc[key].default || CLdoc[key].default == 0) {
                if(!doc[key] && doc[key] !== 0) doc[key] = CLdoc[key].default;
            } if ((CLdoc[key].required === true) && (doc[key] === null || doc[key] === undefined)) {
                return `docRegulate 创建时 必须添加 [doc.${key}] 字段`;
            }
            errMsg = regCLobj(CLdoc, doc, key, payload)
            if(errMsg) return errMsg;
        }
    }

    return null;
};