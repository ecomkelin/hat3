/**
 * 
 * @param {*} CLmodel 这就相当于 CLmodel = require("x/Model.js");
 * @param {*} fileName 为了路由名称传递过来的 名称变量
 * @param {*} newRoute 为了加入路由传递过来的 方法
 * @returns 
 */
module.exports = (CLmodel, fileName, newRoute) => {
    restfulMethod = "post"   // 统一做 post 处理
    /** 查看数据模型中的 一些操作配置 */
    const { GenRoute } = CLmodel.CLoptions;  
    if (!GenRoute) return;

    /** 路由的路径 */
    let urlPre = "/Models/" + fileName + "/"

    /** 如果此操作配置中 有 find findOne delete 等操作信息 则进行路由配置 加入一个新的路由并 配置 路由执行函数 */
    Object.keys(GenRoute).forEach(routeMethod => {
        newRoute(restfulMethod, urlPre + routeMethod, async ctx => {
            try {
               /** 如果需要看 此路由的api 则可以给这个路由加入一个query: showApi=1 */
               if(ctx.request.query.showApi == 1) return resAPI(ctx, GenRoute[routeMethod].api);

               /** 获取 payload 此payload 已经在服务中间件中 配置好了 这里只需要提取 */
                const payload = ctx.request.payload;

                /** 根据模型数据的操作配置 查看是否有权限 */
                if (GenRoute[routeMethod].restrict) {
                    return resNOACCESS(ctx);
                }

                /** payload 加入到 options中 */
                const MToptions = { payload };

                /** 根据 封装的数据库模型 下的路由方法 获取数据并返回 */
                const data = await CLmodel[routeMethod](ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
            } catch (e) {
                return resERR(ctx, e);
            }
        })
    })
}


/**
            if (routeMethod === 'countDocuments') {
                const count = await CLmodel.countDocuments(ctx.req, MToptions);
                return resSUCCESS(ctx, { data:{count} });
             } else if (routeMethod === 'find') {
                const objects = await CLmodel.find(ctx.req, MToptions);
                return resSUCCESS(ctx, { data:{objects} });
             } else if (routeMethod === 'findOne') {
                const object = await CLmodel.findOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data:{object} });
             } else if (routeMethod === 'deleteMany') {
                const deletedObj = await CLmodel.deleteMany(ctx.req, MToptions);
                return resSUCCESS(ctx, { data: {deletedObj} });
             } else if (routeMethod === 'deleteOne') {
                const deletedObj = await CLmodel.deleteOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data: {deletedObj} });
             } else if (routeMethod === 'insertMany') {
                const data = await CLmodel.insertMany(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if (routeMethod === 'insertOne') {
                const data = await CLmodel.insertOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if (routeMethod === 'updateMany') {
                const data = await CLmodel.updateMany(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if (routeMethod === 'updateOne') {
                const data = await CLmodel.updateOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if(routeMethod === 'indexes') {
                const data = await CLmodel.indexes();
                return resSUCCESS(ctx, { data });
             }
 */