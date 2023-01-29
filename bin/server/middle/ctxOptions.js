const jwtMD = require(path.join(process.cwd(), "core/encryption/jwt"));

module.exports = async (ctx, next) => {
    /** body */
    if ((typeof ctx.request.body) === 'object') {
        ctx.reqBody = ctx.request.body;
    } else if ((typeof ctx.request.body) === 'string') {
        try {
            ctx.reqBody = JSON.parse(ctx.request.body);
        } catch(e) {
            return ctx.fail = "前端必须传递正确的 JSON string格式";
        }
    } else {
        ctx.reqBody = {};
    }
    /** 把所有body中的 ObjectId 字符串 转为 ObjectId对象 */
    if (ctx.reqBody instanceof Array) {
        deepArrayId(ctx.reqBody);
    } else if (isObject(ctx.reqBody)) {
        deepObjectId(ctx.reqBody);
    } else {
        return ctx.reqBody = "错误"
    }


    /** 把所有 query 中的 ObjectId 字符串 转为 ObjectId对象 */
    if(isObject(ctx.request.query)) {
        ctx.reqQuery = ctx.request.query
        deepObjectId(ctx.reqQuery);
    }

    /** 挂载 Koptions */
    ctx.Koptions = {};

    const payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);
    ctx.Koptions.payload = payload;
    
    return next();// 如果用 await 那么 系统还会再回访 执行 next(); 下面的句子
    // console.info("如果用 await, 那么执行完 下面的中间件 还会调用这句话")		
};   


/** 深度循环 对象中的 ObjectId 
 * 形参必须为指针
*/
const deepObjectId = (obj) => {
    Object.keys(obj).forEach(key => {
        if (isObject(obj[key])) deepObjectId(obj[key]);
        else if (obj[key] instanceof Array) {
            deepArrayId(obj[key]);
        }
        if (isObjectId(obj[key])) obj[key] = newObjectId(obj[key]);
    })
}
const deepArrayId = (arrs) => {
    for (let i = 0; i < arrs.length; i++) {
        if (isObject(arrs[i])) deepObjectId(arrs[i]);
        else if (arrs[i] instanceof Array) {
            deepArrayId(arrs[i]);
        }
        if (isObjectId(arrs[i])) arrs[i] = newObjectId(arrs[i]);
    }
}