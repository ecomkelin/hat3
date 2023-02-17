const getCLfield = require("../func/getCLfield");

module.exports = (ctxObj, MToptions) => {
    try {
        const {reqBody} = ctxObj;
        let {lookup} = reqBody;

        // const {payload} = ctxObj.Koptions;
        const {CLdoc} = MToptions;
    
        if(!lookup) return;
        if(!(lookup instanceof Array)) lookup = [lookup];
        for(let i in lookup) {
            let lp = lookup[i];
            if(typeof lp === 'string') {
                lookupParseString(reqBody, lp, CLdoc);
            }else if(isObject(lp)) {
                lookupParseObject(reqBody, lp, CLdoc);
            }
        }
    }catch(e) {
        throw "[regulate/lookup]- " + e;
    }
}




const lookupParseObject = (reqBody, lookup, CLdoc) => {
    let {localField} = lookup;
    if(!localField) throw "请在您的 lookup 对象中 配置 localField 告知服务器关联哪个集合"

    const CLobj = getCLfield(CLdoc, localField);

    if(!lookup.foreignField) lookup.foreignField = "_id";
    if(!lookup.as) lookup.as = localField;

    /** 不能单纯的只写 from localField 有可能会有其他参数 比如 pipeline */
    lookupParse(reqBody, CLobj, {...lookup, localField})
}



/** 000000 没有深入写 lookup 只写了一层 或者数组层 */
const lookupParseString = (reqBody, str, CLdoc) => {

    let strs = str.split(" ");

    /** 第一组数据一定是 当前集合的字段 localField  */
    let localField = strs[0].replace(/^\s*/g,"");
    const CLobj = getCLfield(CLdoc, localField);


    /** 000000 这可以优化 比如 相当于 mongoose 写的 select 可以把 lookup 中的 as 表现出来 */
    // let selects;
    // if(strs.length > 1) selects = str[1].split(",");
    
    // let proj_as;
    // if(strs.length > 2) proj_as = str[2]

    let foreignField = "_id";
    let as = localField;

    lookupParse(reqBody, CLobj, {localField, foreignField, as})
}



const lookupParse = (reqBody, CLobj, lookup) => {
    const {localField} = lookup;

    /** 关于 关联到哪个集合 */
    let fms = localField.split("_");                    // 以下两个条件都没有 则自动生成
    let from = fms[fms.length -1];                                      // 等于下划线最后的字符串
    if(from[from.length-1] === 's') from = from.slice(0,from.length-1)  // 如果该字符串的最后一个字母为s 则去掉s

    if(CLobj.ref) from = CLobj.ref;               // 其次以 CLdoc的 ref 为准
    if(lookup.from) from = lookup.from;                 // 首先以 前台传入为准
    lookup.from = from;

    /** 判断 这个field 在集合中是以 对象展开还是以 数组展开 */
    let IS_lookupOne = (from === localField) ? true: false;
    if(CLobj.IS_lookupOne === true || CLobj.IS_lookupOne === false) IS_lookupOne = CLobj.IS_lookupOne;

    if(IS_lookupOne) {
        /** 如果只查询一个的话 要limit 1 */
        lookup.pipeline = [{"$limit": 1}];          

        /** 把数组编程对象 */
        if(!reqBody.unwinds) reqBody.unwinds = []; 
        reqBody.unwinds.push({
            "path": "$"+localField,
            "preserveNullAndEmptyArrays": true
        })
    }
    if(!reqBody.lookups) reqBody.lookups = [];
    reqBody.lookups.push(lookup);
}