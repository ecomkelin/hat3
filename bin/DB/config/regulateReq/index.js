/**
 * 数据过滤 的分发函数文件
 * reqBody 中的 filter document documents update projection lookup skip limit sort  
 */
module.exports = (ctxObj, MToptions) => {
    try {
        // const t = Date.now();
        const { regulates } = MToptions;
        if (!(regulates instanceof Array)) throw "regulateReq中 请传递正确的 req的 regulates";

        for (let i = 0; i < regulates.length; i++) {
            let key = regulates[i];
            require("./method/" + key)(ctxObj, MToptions);
        }
        // console.info("Time: ", Date.now() - t) // 处理时间 1ms 所以不能用异步 因为异步有50ms的函数处理时间
    } catch (e) {
        throw "[regulateReq/index]- " + e;
    }
}