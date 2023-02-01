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
   const { Routes } = CLmodel.CLoptions;
   if (!Routes) return;

   /** 路由的路径 */
   let urlPre = "/Models/" + fileName + "/"

   /** 如果此操作配置中 有 find findOne delete 等操作信息 则进行路由配置 加入一个新的路由并 配置 路由执行函数 */
   Object.keys(Routes).forEach(routeMethod => {
      const routeOption = Routes[routeMethod]
      newRoute(restfulMethod, urlPre + routeMethod, async ctx => {
         try {
            /** 如果需要看 此路由的api 则可以给这个路由加入一个query: showApi=1 */
            if (ctx.request.query.showApi == 1) {
               return ctx.success = {api: routeOption.api || {}};
            }

            /** 执行 完全自定义的 回调方法（如果有的话）*/
            if(routeOption.customizeCB) return routeOption.customizeCB(ctx, CLmodel);
            /** 如果没有则执行 下面的方法 */

            /** 如果没有 完全的自定义 路由方法 则执行以下方式 下面的方式为 mongodb_nodejs */
            if(routeOption.permissionsCB) routeOption.permissionsCB(ctx.Koptions);

            /** 根据 封装的数据库模型 下的路由方法 获取数据并返回 */
            const _CLoptions = { semiCB: routeOption.semiCB };
            const data = await CLmodel[routeMethod](ctx, _CLoptions);

            return ctx.success = {data};
         } catch (e) {
            return ctx.fail = e;
         }
      })
   })
}