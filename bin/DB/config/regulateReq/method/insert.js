const regDocument = require("../func/regDocument");
const regCLdoc = require("../func/regCLdoc");
const regCLoptions = require("../func/regCLoptions");

module.exports = (ctxObj, MToptions) => {
    try {
        const { document, documents } = ctxObj.reqBody;
        const { payload } = ctxObj.Koptions;
        const { CLdoc, CLoptions } = MToptions;
        MToptions.payload = payload;

        let docs = [];
        if (document) docs.push(document);
        else if (documents) docs = documents;

        for (let i in docs) {
            let doc = docs[i];
            /** 下面两个函数(1,2) 不能改变顺序 因为先判断前端给的数据是否符合要求 再自动生成 */

            /** 1  根据 doc数据 判断是否正确 不能直接return 函数 如果函数没有问题 就不会执行下面的额函数了*/
            regDocument(doc, MToptions);

            /** 2 根据数据模型 判断数据是否正确 */
            // 在新创建数据的情况下 判断每个必须的字段 如果前台没有给赋值 则报错
            regCLdoc(CLdoc, doc, MToptions)

            /** 3 查看上传的这些文件 在模型中是否允许被上传 */
            regCLoptions(ctxObj.Koptions, CLoptions)
        }
    } catch (e) {
        throw "[regulate/find-]- " + e;
    }

};