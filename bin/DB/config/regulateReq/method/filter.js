/**
 * 过滤 reqBody.filter
 */
const getCLfield = require("../func/getCLfield");

module.exports = (ctxObj, MToptions) => {
    const {reqBody, Koptions} = ctxObj;
    const { payload } = Koptions;


    const match = {};
    /** 分销模式 区分 Firm 用的 */
    let Firm = null;
    if (payload.Firm) Firm = payload.Firm;
    if (Firm) match.Firm = Firm;

    if(reqBody.match) {
        reqBody.match = {...reqBody.match, ...match};
    } else{
        reqBody.match = match;
        filterParse(reqBody.match, reqBody.filter, MToptions.CLdoc)
    }

    
    
}


const filterParse = (match, filter, CLdoc) => {
    let { _id, search, exact = {}, includes = {}, excludes = {}, lte = {}, gte = {}, at_before = {}, at_after = {} } = filter;
    if (_id) {   // 一定是 ***One 方法
        if (!isObjectIdAbs(_id)) return { errMsg: "filter._id 必须为 ObjectId 类型" };
        match._id = _id;
    }

    if (search) {
        let exactOr = [];
        /** 参数 fields 需要模糊查询的字段（可以是 数组）
         * keywords 需要查询的 字符串
         */
        if (!search.fields) return { errMsg: "filter.search 参数错误 需要传递 [search.fields] 参数" };
        search.keywords = String(search.keywords).replace(/(\s*$)/g, "").replace(/^\s*/, '');
        if (!search.keywords) {  // 要这么写 因为 如果给一个空字符串 不能算错误
            search.fields = null;
            search.keywords = null;
        } else {
            let keywords = new RegExp(search.keywords + '.*');
            search.fields = (search.fields instanceof Array) ? search.fields : [search.fields];
            for (let i in search.fields) {
                let field = search.fields[i];
                let docField = getCLfield(CLdoc, field);
                if (docField.errMsg) return { errMsg: '[filter.search.fields]: ' + docField.errMsg };

                if (docField.type !== String) return { errMsg: `数据层readPre [filter.search.fields 的值 ${field}] 错误, 应该传递类型为<String>的<field>` };
                exactOr.push({ [field]: { $regex: keywords, $options: 'i' } });
            }
        }
        if (exactOr.length > 0) match["$or"] = exactOr;
    }

    for (let key in exact) {
        /** exact 为对象 对象的key为要匹配的字段 val为要精确匹配的数值 */
        let docField = getCLfield(CLdoc, key);
        if (docField.type === ObjectId) return "exact 中不传递 ObjectId 的值 需要的话 请放到 includes中"
        if (docField.errMsg) {
            if (IS_STRICT) {
                return docField.errMsg;
            } else {
                continue;
            }
        }
        match[key] = exact[key];
    }

    for (let key in includes) {
        /** includes: {key: vals} 
         * 获取 模型 字段
        */
        let docField = getCLfield(CLdoc, key);
        if (docField.errMsg) return docField.errMsg;
        if (docField.type !== ObjectId) return `[filter.includes.${key}] 在模型中不为 ObjectId`;

        let val = includes[key];
        if (val instanceof Array) {
            for (let i = 0; i < val.length; i++) {
                if (!isObjectIdAbs(val[i])) {
                    /** 如果不是 ObjectId 是对象的话 查找 则把对象中的 _id 提取出来 */
                    if (isObject(val[i]) && isObjectIdAbs(val[i]._id)) val[i] = val[i]._id;
                    else return `[filter.includes.${key}] 类型为 ObjectId`;
                }
            }
            match[key] = { "$in": val };
        } else {
            if (!isObjectIdAbs(val)) {
                /** 如果不是 ObjectId 是对象的话 查找 则把对象中的 _id 提取出来 */
                if (isObject(val) && isObjectIdAbs(val._id)) val = val._id;
                else return `[filter.includes.${key}] 类型为 ObjectId`;
            }
            match[key] = val;
        }
    }
    // for (let key in excludes) {
    //     /** excludes: {key: vals} 
    //      * 获取 模型 字段
    //     */
    //     let docField = getCLfield(CLdoc, key);
    //     if (docField.errMsg) return docField.errMsg;
    //     if (docField.type !== ObjectId) return `[filter.excludes.${key}] 在模型中不为 ObjectId`;

    //     let val = excludes[key];
    //     if (val instanceof Array) {
    //         for (let i = 0; i < val.length; i++) {
    //             if (!isObjectIdAbs(val[i])) {
    //                 /** 如果不是 ObjectId 是对象的话 查找 则把对象中的 _id 提取出来 */
    //                 if (isObject(val[i]) && isObjectIdAbs(val[i]._id)) val[i] = val[i]._id;
    //                 else return `[filter.excludes.${key}] 类型为 ObjectId`;
    //             }
    //         }
    //         match[key] = { "$nin": val };
    //     } else {
    //         if (!isObjectIdAbs(val)) {
    //             /** 如果不是 ObjectId 是对象的话 查找 则把对象中的 _id 提取出来 */
    //             if (isObject(val) && isObjectIdAbs(val._id)) val = val._id;
    //             else return `[filter.excludes.${key}] 类型为 ObjectId`;
    //         }
    //         match[key] = { "$ne": val };
    //     }
    // }

    for (let key in lte) {
        let docField = getCLfield(CLdoc, key);
        if (docField.errMsg) {
            if (IS_STRICT) return docField.errMsg;
            else continue;
        }
        if (!docField.type) return `[filter.lte 的 key ${key}] 必须为基础类型`;
        match[key] = { "$lte": lte[key] };
    }

    for (let key in gte) {
        let docField = getCLfield(CLdoc, key);
        if (docField.errMsg) {
            if (IS_STRICT) return docField.errMsg;
            else continue;
        }

        if (!docField.type) return `[filter.gte 的 key ${key}] 必须为基础类型`;

        match[key] = { "$gte": gte[key] };
    }
    for (let key in at_before) {
        let docField = getCLfield(CLdoc, key);
        if (docField.errMsg) {
            if (IS_STRICT) {
                return docField.errMsg;
            } else {
                continue;
            }
        }

        if (docField.type !== Date) return `[filter.at_before 的 key ${key}] 必须为 Date 类型`;
        if(!isNaN(at_before[key])) at_before[key] = parseInt(at_before[key]);   // 如果收到的是时间戳

        let before = (new Date(at_before[key]).setHours(23, 59, 59, 999));      // 按天算时间
        match[key] = { "$lte": before };
    }
    for (let key in at_after) {
        let docField = getCLfield(CLdoc, key);
        if (docField.errMsg) {
            if (IS_STRICT) {
                return docField.errMsg;
            } else {
                continue;
            }
        }

        if (docField.type !== Date) return `[filter.at_after 的 key ${key}] 必须为 Date 类型`;
        if(!isNaN(at_after[key])) at_after[key] = parseInt(at_after[key]);   // 如果收到的是时间戳

        let after = (new Date(at_after[key]).setHours(0, 0, 0, 0));     // 按天算时间
        match[key] = { "$gte": after };
    }
}