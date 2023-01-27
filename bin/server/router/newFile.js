
const genApiFromModel = require("./genApiFromModel")
const restfulMethods = ['get', 'post', 'put', 'delete'];

/** 每个扫描到一个符合要求的文件 执行此函数
 * @param {*} fileType 除去.js 后的 自定义文件类型
 * @param {*} reqFile   require此文件 把对象（函数）付给 reqFile 变量 相当于 reqFile = require("xxx/xxx.js")
 * @param {*} fileName  文件的名称
 * @param {*} paths     相对扫描文件的根目录 本文件的绝对路径上的 所有文件夹名称
 * @param {*} n         所在相对 扫描文件的根目录 文件在第几层 （因为递归问题 需要用此数来解决 paths 不能清除n后面的记录问题)
 * @returns 
 */
module.exports = (fileType, reqFile, fileName, paths, n, newRoute) => {
   let dirStr = '';
   for (let level = 1; level <= n; level++) dirStr += '/' + paths[level];

   let restfulMethod = 'get';             // restfulMethod 默认为 get
   let url = dirStr + '/' + fileName;   // url 默认为 从第二层级文件夹开始 order/op/.... + / + 文件名称（不加后缀）
   let reqFunc = reqFile;                 // 路由的 执行函数 


   if (fileType === 'api') {
      /** 如果文件的中间名为 api 则说明 此文件为 exports.function 文件
       * 里面的函数 名称 如果不包含 下划线 则方法为 get 函数名为路由路径名称
       * 否则 第一个下划线 左边为 方法（get/post/put/delete) 如果不是这四种 则为默认 get
       * 第一个下划线 右边的方法 为 路由路径名称
       * 路由的路径名称为 文件夹名称 + 文件名称 + 方法名称
       */
      for (funcName in reqFile) {
         let fns = funcName.split('_');
         reqFunc = reqFile[funcName];     // 找出需要调用的方法
         if (fns.length === 1) {          // 如果函数的对象名 不包含下划线 则默认为 get  url直接用对象名
            url = dirStr + '/' + fileName + '/' + fns[0];
         } else if (fns.length > 1) {     // 如果包含下划线 下划线左边 为 restfulMethod 右边的名称被url使用
            restfulMethod = fns[0];
            url = dirStr + '/' + fileName + '/' + fns[1];
         }
         newRoute(restfulMethod, url, reqFunc);
      }
      return;
   } else if (restfulMethods.includes(fileType)) {
      /** 如果文件的中间名称为 restful 其中的一个方法 ：
       * 路由的路径名称为 文件夹名称 + 文件名称
       */
      restfulMethod = fileType;
      return newRoute(restfulMethod, url, reqFunc);
   } else if (fileType === 'Conf') {
      /** 生成 Config 路由 方法 
       * 路由的路径名称为 文件夹名称 + 文件名称
      */
      reqFunc = ctx => resSUCCESS(ctx, { Config: reqFile });
      return newRoute(restfulMethod, url, reqFunc);
   } else if (fileType === 'Model') {
      /** 生成 Model 模型 路由 方法 */

      reqFunc = ctx => resSUCCESS(ctx, { model: reqFile.CLmodel });

      newRoute(restfulMethod, url, reqFunc);

      /** 如果 模型需要则自动生成一些 基础的 api路由 Model文件的 reqFile 就是其 CLmodel */
      genApiFromModel(reqFile, fileName, newRoute);
      return;
   }
}