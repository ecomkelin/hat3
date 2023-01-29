const regDocument = require("../func/regDocument");
const regCLdoc = require("../func/regCLdoc");

module.exports = (req, Koptions) => {
    const {documents} = req;
    if (!(documents instanceof Array)) return "regulateReq documents 中的 docs 必须为 数组";

    for(i in documents) {
        const document = documents[i];
        /** 根据 doc数据 判断是否正确 */
        let errMsg = regDocument(document, Koptions);
        if (errMsg) return errMsg;

        /** 根据数据模型 判断数据是否正确 */
        errMsg = regCLdoc(document, Koptions);
        if (errMsg) return errMsg;
    }

    return null;
};