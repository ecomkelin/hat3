module.exports = (req, MToptions) => {
    const {regulates} = MToptions;
    if(!(regulates instanceof Array)) return "regulateReq中 请传递正确的 req的 regulates";

    for(let i=0; i<regulates.length; i++) {
        let key = regulates[i];
        let errMsg = require("./method/"+key)(req, MToptions);
        if(errMsg) return errMsg;
    }
}