const koa = require('koa');
const server = new koa();

/** 最后要执行的中间件 
 * 因为代码写在 await next() 后面 
 * 承接所有的结果
 */
server.use(require("./middle/response"));

/** 日志打印中间件 */
server.use(require("./middle/log"));

/** 传输压缩 */
const compress = require('koa-compress');
server.use(compress({}));

/** 身份中间件 */
server.use(require("./middle/payload"));

/** body 中间件 */
const { koaBody } = require('koa-body');
server.use(koaBody());
/** 格式化 body 把所有的 字符串形式的 ObjectId 转为 真正的 ObjectId */
server.use(require("./middle/reqFormat"))

/** 配置静态文件夹 */
const DIR_PUBLIC = path.resolve(process.cwd(), "public/");
const koaStatic = require('koa-static');
server.use(koaStatic(DIR_PUBLIC));

/** 文件中间件 文件传输系统 */
server.use(require("./middle/upload"))


/** 路由中间件 因为是最后的中间件 可以不加 next */
const router = require("./router");
server.use(router.routes());
server.use(router.allowedMethods()); // 比如 post: login 用户使用了 get 则报 405



module.exports = server;