const getCLfield = require("../func/getCLfield");

module.exports = (ctxObj, MToptions) => {
    try {
        /** sort */
        const { reqBody = {} } = ctxObj;
        const { sort = {} } = reqBody;
        // const { CLdoc } = MToptions;
        if (!isObject(sort)) throw "find sort 必须为对象"
        let hasSort = 0;
        for (let key in sort) {
            hasSort++;
            if(key.length < 1) throw "sort 属性有一个是空 是错误的"
            if (sort[key] !== -1 && sort[key] !== "-1") sort[key] = 1;
        }
        if(hasSort === 0) delete reqBody.sort;

        /** limit */
        if (isNaN(reqBody.limit)) reqBody.limit = 60;
        reqBody.limit = parseInt(reqBody.limit);
        if (reqBody.limit < 1) reqBody.limit = 60;

        /** skip */
        if (isNaN(reqBody.skip)) reqBody.skip = 0;
        reqBody.skip = parseInt(reqBody.skip);
        if (reqBody.skip < 0) reqBody.skip = 0;
    } catch (e) {
        throw "[regulate/find-]- " + e;
    }
}