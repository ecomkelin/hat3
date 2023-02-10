const getCLfield = require("../func/getCLfield");

module.exports = (ctxObj, MToptions) => {
    try {
        const { reqBody = {} } = ctxObj;
        const { projection = {} } = reqBody;
        const { CLdoc } = MToptions;
        if (!isObject(projection)) throw "projection 错误 应该给 对象 数据"
        /** 筛选前端给的合理性 */
        let hasProject = 0;
        /** 只要有0 则hasZero[0] 为1 只要有非0 则hasZero[1] 为1 */
        let hasZero = [0, 0];
        for (let key in projection) {
            let CLobj = getCLfield(CLdoc, key);
            /** 不在判断 projection 的配置项是否为 集合字段了， 因为lookup （而且深度查看也不好做程序） 不做也没有什么影响 */
            hasProject++;
            if (CLobj.IS_unReadable) { // 如果 字段不可读
                delete projection[key];
            } else { // 字段 可读
                if (!isNaN(projection[key])) projection[key] = parseInt(projection[key]);
                if (projection[key] === 0 && hasZero[0] === 0) hasZero[0] = 1;
                if (projection[key] !== 0 && hasZero[1] === 0) hasZero[1] = 1;

                if (projection[key] != 1 && isNaN(projection[key])) {
                    projection[projection[key]] = "$" + key;
                    delete projection[key];
                }
            }
        }
        if (hasZero[0] + hasZero[1] > 1) throw "projection 中不能同时存在 0 和 非0 的两种状态";

        /** 如果前端没有给select 后端自动过滤不可读的字段 */
        for (let key in CLdoc) {   // 如果没有select 则需要自动去掉不可读的数据
            if (CLdoc[key].IS_unReadable) {
                if (hasZero[1]) {
                    delete projection[key];
                } else {
                    projection[key] = 0;
                    hasProject++;
                }
            }
        }
        // if(hasProject === 0) delete reqBody.projection;
    } catch (e) {
        throw "[regulate/projection]- " + e;
    }
}