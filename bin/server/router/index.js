/**
 * @description: 整个系统的 总 路由文件
 * @author: kelin
*/
/** 声明路由器 */
// const prefix = "/v1";
// const router = require('@koa/router')({prefix});
const koaRouter = require('@koa/router');
const router = koaRouter();


const routeObjs = [];   // 为了方便查看 所有路由 每当有新的路由 则自动push到此内存 最后统一输出
/** 增加一个新路由 打包成一个方法 以便管理 
 * addRoute(restfulMethod, routePath, reqFunc) 是一个函数
*/
const addRoute = require("./addRoute")(router, routeObjs);



/** 读取 符合要求的文件 自动加载路由
 * 加载方法写在 readFiles 里面
*/
require("./readFiles")(addRoute);





/** ====================================== 下面是两个手动写的路由 ====================================== */

/** get("/")
 * 功能: 查看自动加载的所有路由的路径
*/
require("./routeIndex")(router, routeObjs);



/** get("/initAdmin[?code=<admin>&pwd=<111111>&role=<10>")
 * 功能对最高身份的初始化 
*/
if(IS_DEV) require("./routeInitAdmin")(router);



module.exports = router;