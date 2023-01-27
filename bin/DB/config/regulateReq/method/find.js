const getCLfield = require("../func/getCLfield");

module.exports = (req, MToptions) => {
    /** sort */
    const {sort={}} = req;
    const {CLdoc} = MToptions;
    if(!isObject(sort)) return "regulateReq find sort 必须为对象"
    let hasSort = 0;
    for(key in sort) {
        let docField = getCLfield(CLdoc, key);
        if(docField.errMsg) if(errMsg) return param.errMsg = docField.errMsg;
        hasSort++;
        if(sort[key] !== -1 && sort[key] !== "-1")  sort[key] = 1;
    }
    if(hasSort === 0) delete req.sort;

    /** limit */
    if(isNaN(req.limit)) req.limit = 60;
    req.limit = parseInt(req.limit);
    if(req.limit < 1) req.limit = 60;

    /** skip */
    if(isNaN(req.skip)) req.skip = 0;
    req.skip = parseInt(req.skip);
    if(req.skip < 0) req.skip = 0;

}