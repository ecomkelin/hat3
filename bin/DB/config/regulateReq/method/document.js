const regDocument = require("../func/regDocument");
const regCLdoc = require("../func/regCLdoc");

module.exports = (ctxObj, MToptions) => {
    const {document} = ctxObj.reqBody;
    const {payload} = ctxObj.Koptions;
    /** 下面两个函数 不能改变顺序 因为先判断前端给的数据是否符合要求 再自动生成 */
    /** 根据 doc数据 判断是否正确 */
    let errMsg = regDocument(document, MToptions);
    if (errMsg) return errMsg;

    /** 根据数据模型 判断数据是否正确 */
    errMsg = regCLdoc(document, MToptions, payload);
    if (errMsg) return errMsg;

    return null;
};