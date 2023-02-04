/**
 * @param {*} CLmodel 这就相当于 CLmodel = require("x/Model.js");
 * @param {*} fileName 为了路由名称传递过来的 名称变量
 * @param {*} newRoute 为了加入路由传递过来的 方法
 */
module.exports = (CLmodel, fileName, newRoute) => {
   let restfulMethod = "post"   // 统一做 post 处理
   /** 查看数据模型中的 一些操作配置 */
   const { RouteMethods, Routes = {}, customizeCB = {}, api = {} } = CLmodel.CLoptions;

   /** 路由的路径 */
   let urlPre = "/v2/" + fileName + "/";
   /** 如果此操作配置中 有 find findOne delete 等操作信息 则进行路由配置 加入一个新的路由并 配置 路由执行函数 */
   Object.keys(customizeCB).forEach(key => {
      /** 获取 customizeCB 下面的方法对象 */
      const routeFunc = customizeCB[key];
      if ((typeof routeFunc) !== 'function') return;
      // newRoute('get', urlPre + key, ctx => ctx.success = { api: api[key] || {} });
      newRoute(restfulMethod, urlPre + key, routeFunc);
   })

   /** 如果此操作配置中 有 find findOne delete 等操作信息 则进行路由配置 加入一个新的路由并 配置 路由执行函数 
    * 这里的 key 只能是 封装好的数据库方法
   */
   /** 路由的路径 */
   urlPre = "/Models/" + fileName + "/";
   Object.keys(Routes).forEach(key => {
      const if_noMethod = `${fileName} 模型文件 下的 CLoptions.Route 中的 ${key} 方法 不存在于 数据库包装方法`;
      const routeOption = Routes[key];
      const { permissionCB, permissionConf } = routeOption;

      newRoute(restfulMethod, urlPre + key, async ctx => {
         try {
            if (RouteMethods.indexOf(key) < 0) return ctx.fail = { status: 500, errMsg: if_noMethod };
            /** 如果需要看 此路由的api 则可以给这个路由加入一个query: showApi=1 */
            if (ctx.request.query.showApi == 1) {
               return ctx.success = { api: api[key] || {} };
            }

            /** 如果没有 完全的自定义 路由方法 则执行以下方式 下面的方式为 mongodb_nodejs */
            if (permissionCB) {
               permissionCB(ctx.Koptions);
            } else if (permissionConf) {
               const {roles} = permissionConf;
               if(!(roles instanceof Array)) return ctx.fail = "权限配置错误"
               const {payload} = ctx.Koptions;
               if(!payload || !payload.role) return ctx.status = 401;
               if(roles.indexOf(payload.role) === -1) return ctx.status = 401
            }

            /** 根据 封装的数据库模型 下的路由方法 获取数据并返回 */
            const data = await CLmodel[key](ctx, routeOption);

            return ctx.success = { data };
         } catch (e) {
            return ctx.fail = e;
         }
      })
   })
}