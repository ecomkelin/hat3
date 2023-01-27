const regDocument = require("./method/regDocument");
const regCLdoc = require("./method/regCLdoc");

module.exports = (req, MToptions) => {
    const {documents} = req;
    if (!(documents instanceof Array)) return "reqRegulate documents 中的 docs 必须为 数组";

    for(i in documents) {
        const doc = documents[i];
        /** 根据 doc数据 判断是否正确 */
        let errMsg = regDocument(doc, MToptions);
        if (errMsg) return errMsg;

        /** 根据数据模型 判断数据是否正确 */
        errMsg = regCLdoc(doc, MToptions);
        if (errMsg) return errMsg;
    }

    return null;
};