const getCLfield = require("../func/getCLfield");

module.exports = (ctxObj, MToptions) => {
    const {reqBody = {}} = ctxObj;
    const {projection = {}} = reqBody;
    const {CLdoc} = MToptions;
    if(!isObject(projection)) return "projection 应该是 对象"
    /** 筛选前端给的合理性 */
    let hasProject = 0;
    let hasZero = [0, 0];
    for(key in projection) {
        let docField = getCLfield(CLdoc, key);
        if(docField.errMsg) return `[queryObj.projection 的 ${key}] 不是该数据的字段`+docField.errMsg;
        hasProject++;
        if(docField.is_UnReadable) { // 如果 字段不可读
            if(IS_STRICT)  if(projection[key] == 1) return `[queryObj.projection 的 ${key}] 不能显示`;
            else delete projection[key];
        } else { // 字段 可读
            if(!isNaN(projection[key])) projection[key] = parseInt(projection[key]);
            if(projection[key] === 0 && hasZero[0] === 0) hasZero[0] = 1;
            if(projection[key] !== 0 && hasZero[1] === 0) hasZero[1] = 1;

            if(projection[key] != 1 && isNaN(projection[key]) ) {
                projection[projection[key]] = "$"+key;
                delete projection[key];
            }
        }
    }
    if(hasZero[0] + hasZero[1] > 1) return "projection 中不能同时存在 0 和 非0 的两种状态";

    /** 如果前端没有给select 后端自动过滤不可读的字段 */
    for(key in CLdoc) {   // 如果没有select 则需要自动去掉不可读的数据
        if(CLdoc[key].is_UnReadable) delete projection[key];
    }
    if(hasProject === 0) delete reqBody.projection;
}