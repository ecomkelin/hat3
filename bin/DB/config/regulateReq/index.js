module.exports = (req, Koptions) => {
    // const t = Date.now();
    const {regulates} = Koptions;
    if(!(regulates instanceof Array)) return "regulateReq中 请传递正确的 req的 regulates";

    for(let i=0; i<regulates.length; i++) {
        let key = regulates[i];
        let errMsg = require("./method/"+key)(req, Koptions);
        if(errMsg) return errMsg;
    }
    // console.info("Time: ", Date.now() - t) // 处理时间 1ms 所以不能用异步 因为异步有50ms的函数处理时间
}