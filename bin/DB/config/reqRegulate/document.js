const regDocument = require("./method/regDocument");
const regCLdoc = require("./method/regCLdoc");

module.exports = (req, MToptions) => {
    const {document} = req;

    /** 根据 doc数据 判断是否正确 */
    let errMsg = regDocument(document, MToptions);
    if (errMsg) return errMsg;

    /** 根据数据模型 判断数据是否正确 */
    errMsg = regCLdoc(document, MToptions);
    if (errMsg) return errMsg;

    return null;
};