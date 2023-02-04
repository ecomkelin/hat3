/**
 * 过滤 reqBody 中的 update 对象
 */
const regDocument = require("../func/regDocument");
const regCLdoc = require("../func/regCLdoc");
const regCLoptions = require("../func/regCLoptions");


const upd_keys = ["$set", "$mul", "$inc"]    // 暂时用这三个
// const upd_keys = ["$set", "$unset", "$mul", "$inc", "$rename"]
module.exports = (ctxObj, MToptions) => {
    try {

        const { update = {} } = ctxObj.reqBody;
        const { payload } = ctxObj.Koptions;
        const { CLdoc, CLoptions } = MToptions;
    
        if (!isObject(update)) throw "regulateReq update 中的 update 要为对象"
    
        MToptions.is_upd = true;
        MToptions.payload = payload;
    
        const updMethods = Object.keys(update);
    
        for (let i in updMethods) {
            const updMethod = updMethods[i];
    
            if (!upd_keys.includes(updMethod)) throw `update["$set", "$mul", "$inc"] 暂时只有这三个值 不能是 ${updMethod}`;
            let is_set = (updMethod === "$set") ? true : false;
    
            let doc = update[updMethod];
    
            if (is_set) {
                /** 下面两个函数(1,2) 不能改变顺序 因为先判断前端给的数据是否符合要求 再自动生成 */
    
                /** 1  根据 doc数据 判断是否正确 */
                regDocument(doc, MToptions);
    
                /** 2 根据数据模型 判断数据是否正确 
                 * 在更新的情况下 如果不可更改 则跳过： 比如创建时间 后面的代码就不用执行了
                */
                regCLdoc(CLdoc, doc, MToptions)
    
    
                /** 3 查看上传的这些文件 在模型中是否允许被上传 */
                regCLoptions(ctxObj.Koptions, CLoptions)
            } else {
                for (let key in doc) {
                    if (isNaN(doc[key])) throw "update[inc/mul] 的值 只能为数字"
                }
            }
        }
    } catch(e) {
        throw "[regulate/update]- " + e;

    }

};