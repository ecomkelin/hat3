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
const restfulMethods = ['get', 'post', 'put', 'delete'];
/** 自动新增一个路由
 * @param {*} restfulMethod 路由的类型
 * @param {*} routePath    路由的路径
 * @param {*} reqFunc   路由的执行函数
 * @returns 并把此路由收集到 routeObjs中 交由最后一个路由统一暴露
 */
const newRoute = (restfulMethod, routePath, reqFunc) => {
   if (!restfulMethods.includes(restfulMethod)) {
      console.error(`注意：${routePath} 此路径的 方法不对 没有加载到系统`)
      return;
   };
   let routeObj = restfulMethod + " - " + routePath.toLowerCase();
   if (routeObjs.includes(routeObj)) {
      console.error("注意: 有相同路径的路由", routeObj);
      return;
   }
   routeObjs.push(routeObj);

   router[restfulMethod](routePath, reqFunc);
}

const newFile = require("./newFile");




/**
 * @param {Path} dirPath 当前绝对路径
 * @param {Array} paths 经过的所有 路径的 文件夹名称
 * @param {Number} n 路径的层级
 */
const fs = require('fs');
const recuRoutes = (dirPath, paths, n) => {
   fs.readdirSync(dirPath).forEach(readName => {
      let fns = readName.split('.'); // 模糊判断是否 文件夹 或文件
      let dirLen = fns.length;

      if (dirLen === 1) {           // 如果是文件夹 则进一步读取内容
         paths[n + 1] = readName;    // 第number层
         let dns = readName.split('_')
         if (dns.length === 1) {  //   如果文件夹用 下划线拆分 则不读取里面的内容
            recuRoutes(path.join(dirPath + readName + '/'), paths, n + 1);
         }
      } else if (dirLen === 3 && fns[dirLen - 1] === "js") {   // 如果是js文件
         let fileType = fns[1];         // 路由的获取地址方式 get post put delete
         let file = dirPath + readName;
         if (fs.existsSync(file)) {    // 每个文件为一个api
            let reqFile = require(file);  // require 文件

            let fileName = readName.split('.')[0];
            newFile(fileType, reqFile, fileName, paths, n, newRoute);
         }
      }
   });
}
const pathAbsolute = path.join(process.cwd(), "src/")
recuRoutes(pathAbsolute, ['src'], 0);


router.get('/', ctx => {
   let { filter } = ctx.query;
   filter = filter ? filter.toLowerCase() : "";
   const routes = routeObjs.filter(item => item.toLowerCase().indexOf(filter) !== -1);

   return ctx.success = {
      desc: "显示了所有路由的列表",
      filter: "可以用query筛选查看。形式为 ?filter='xxx'",
      couter: routes.length + ' / ' + routeObjs.length,
      routes
   }
});    // /routers 路由 查看所有路由

if(IS_DEV) {
   const CLmodelUser = modelsMap.User;
   router.get('/initAdmin', async ctx => {
      try {
         const {code="admin", pwd="111111", role="10"} = ctx.request.query;
         console.log(code)
         console.log(pwd)
         console.log(role)
         let data = await CLmodelUser.COLLECTION.findOne({code});
         if(data) return ctx.success = {data}
         ctx.reqBody.document = {
            code,
            pwd,
            role
         }
         await CLmodelUser.insertOne(ctx);
         ctx.success = "success"
      } catch(e) {
         ctx.fail = e
      }
   })
}

module.exports = router;