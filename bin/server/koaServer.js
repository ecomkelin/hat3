const koa = require('koa');
const server = new koa();

/** 传输压缩 */
const compress = require('koa-compress');
server.use(compress({}));

/** 配置静态文件夹 */
const DIR_PUBLIC = path.resolve(process.cwd(), "public/");
const koaStatic = require('koa-static');
server.use(koaStatic(DIR_PUBLIC));

/** 配置可以上传文件的 koa-body 中间件可接收文件 */
const DIR_UPLOAD = path.resolve(process.cwd(), "public/upload/");
require("./middle/koaBody")(server, DIR_UPLOAD);

/** 日志打印中间件 */
server.use(require("./middle/log"));
/** 身份中间件 */
server.use(require("./middle/payload"));

/** 路由中间件 */
const router = require("./router");
server.use(router.routes());
server.use(router.allowedMethods()); // 比如 post: login 用户使用了 get 则报 405

module.exports = server;