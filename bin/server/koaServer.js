const koa = require('koa');
const server = new koa();

/** 配置静态文件夹 要放在这 不然访问静态资源的话 后台就会有输出 时间  */
const koaStatic = require('koa-static');
server.use(koaStatic(DIR_PUBLIC));
// /** 手动卸 KoaStatic */
// app.use(async (ctx, next) => {
//     if (ctx.path.startsWith('/images/')) {
//         const imagePath = decodeURI(ctx.path.slice('/images/'.length));
//         const imageFullPath = path.resolve(__dirname, imagePath);
//         if (fs.existsSync(imageFullPath)) {
//             const imageBuffer = fs.readFileSync(imageFullPath);
//             ctx.set('Content-Type', 'image/png');
//             ctx.body = imageBuffer;
//         } else {
//             ctx.throw(404, 'Image not found');
//         }
//     } else {
//         await next();
//     }
// });

/** 与前端的触点
 * 1 打印开始日志
 * 2 挂载 Koptions 和 payload
 * 3 await next()
 * 一 返回给前端 ctx.body
 * 二 打印结束日志
 */
server.use(require("./middle/contactFront"));

/** 跨域问题 如果需要就打开 */
const cors = require('@koa/cors');
server.use(cors({
    credentials: true,
}));


/** 传输压缩 */
const compress = require('koa-compress');
server.use(compress({}));

/** body 中间件, 并初始化 挂载一些对象到 ctx上 比如 Koptions */
const { koaBody } = require('koa-body');
server.use(koaBody());


/** 文件中间件 文件传输系统 */
server.use(require("./middle/handlefile"))

/** 格式化 body 把所有的 字符串形式的 ObjectId 转为 真正的 ObjectId */
server.use(require("./middle/reqParse"))


/** 路由中间件 因为是最后的中间件 可以不加 next */
const router = require("./router");
server.use(router.routes());
server.use(router.allowedMethods()); // 比如 post: login 用户使用了 get 则报 405



module.exports = server;