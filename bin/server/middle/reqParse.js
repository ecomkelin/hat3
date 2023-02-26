
const {updateKeys} = require(path.resolve(process.cwd(), 'core/constant'));

module.exports = async (ctx, next) => {
    /** 把所有 query 中的 ObjectId 字符串 转为 ObjectId对象 */
    if(isObject(ctx.request.query)) {
        ctx.reqQuery = ctx.request.query
        deepObjectId(ctx.reqQuery);
    }

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
        return ctx.fail = "没有安装 koa-body";
    }


    if(ctx.reqBody.update) {
        const update = ctx.reqBody.update;
        if (!isObject(update)) return ctx.fail = "reqParse reqBody如果有update 那么 update 要为对象"
    
        const keys = Object.keys(update);
        let hasMethod = [0, 0]; // hasMethod[0] 为包含update方法  hasMthod[1] 不包含
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (key[0] === "$" && !updateKeys.includes(key)) return ctx.fail = `middle reqParse update 暂不支持此 ${key} 更新方式`
            if (updateKeys.includes(key)) {
                hasMethod[0] = 1;   // 如果是 update 方法 则为1
            } else {
                hasMethod[1] = 1;   // 如果不是update的方法 则为1
            }
            if (hasMethod[0] + hasMethod[1] === 2) return ctx.fail = "middle reqParse update 请写入正确的 update 的更新方式"
        }
        /** 如果前端没有给update方法 updateKeys 则默认 update对象为 update的 set方法 */
        if (hasMethod[1] === 1) ctx.reqBody.update = {"$set": update};
        if(!ctx.reqBody.update["$set"])ctx.reqBody.update["$set"] = {};
    }

    return next();// 如果用 await 那么 系统还会再回访 执行 next(); 下面的句子
    // console.info("如果用 await, 那么执行完 下面的中间件 还会调用这句话")		
};   

/** 深度循环 对象中的 ObjectId 
 * 形参必须为指针
*/
const deepObjectId = (obj) => {

    Object.keys(obj).forEach(key => {
        if (isObject(obj[key])) {
            deepObjectId(obj[key]);
        }
        else if (obj[key] instanceof Array) {
            deepArrayId(obj[key]);
        }
        if (isObjectId(obj[key])) {
            obj[key] = newObjectId(obj[key]);
        }
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