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
   const { AutoRoute } = CLmodel.CLoptions;
   if (!AutoRoute) return;

   /** 路由的路径 */
   let urlPre = "/Models/" + fileName + "/"

   /** 如果此操作配置中 有 find findOne delete 等操作信息 则进行路由配置 加入一个新的路由并 配置 路由执行函数 */
   Object.keys(AutoRoute).forEach(routeMethod => {
      const routeOption = AutoRoute[routeMethod]
      newRoute(restfulMethod, urlPre + routeMethod, async ctx => {
         try {
            /** 如果需要看 此路由的api 则可以给这个路由加入一个query: showApi=1 */
            if (ctx.request.query.showApi == 1) {
               return ctx.success = {api: routeOption.api};
            }

            /** 获取 payload 此payload 已经在服务中间件中 配置好了 这里只需要提取 */
            const payload = ctx.Koptions.payload;

            /** 根据模型数据的操作配置 查看是否有权限 */
            if (routeOption.pass) {
               console.info(payload);
            } else if (routeOption.restrict) {
               return ctx.fail = {status: 401, errMsg: "您没有权限"};
            }

            // if(routeOption.customizeCB) {
            //    await routeOption.customizeCB(ctx, CLmodel)
            // }

            /** 根据 封装的数据库模型 下的路由方法 获取数据并返回 */
            const data = await CLmodel[routeMethod](ctx);
            return ctx.success = {data};
         } catch (e) {
            return ctx.fail = e;
         }
      })
   })
}