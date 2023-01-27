const { koaBody } = require('koa-body');

/** 深度循环 对象中的 ObjectId 
 * 形参必须为指针
*/
const deepObjectId = (obj) => {
    Object.keys(obj).forEach(key => {
        if (isObject(obj[key])) deepObjectId(obj[key]);
        else if (obj[key] instanceof Array) {
            deepArrayId(obj[key]);
        }
        if (isObjectId(obj[key])) obj[key] = newObjectId(obj[key]);
    })
}
const deepArrayId = (arrs) => {
    for (let i = 0; i < arrs.length; i++) {
        if (isObject(arrs[i])) deepObjectId(arrs[i]);
        else if (arrs[i] instanceof Array) {
            deepArrayId(arrs[i]);
        }
        if (isObjectId(arrs[i])) arrs[i] = newObjectId(arrs[i]);
    }
}

// server.use(koaBody());
/** 配置可以上传文件的 koa-body */
module.exports = (server, uploadDir) => {
    server.use(koaBody({
        multipart: true,    // 打开多媒体上传
        formidable: {
            // option里的路径 不推荐使用相对路径， 因为option里的相对路径 不是当前文件的相对路径，而是当前进程 process.cwd()的相对路径。当前脚本在koa2执行
            uploadDir, // 要上传的文件 被传到哪个文件下 
            keepExtensions: true
        }
    }));

    /** 直接用 ctx.req 接收 */
    server.use(async (ctx, next) => {
        if ((typeof ctx.request.body) === 'object') {
            ctx.req = ctx.request.body;
        } else if ((typeof ctx.request.body) === 'string') {
            ctx.req = JSON.parse(ctx.request.body);
        } else {
            ctx.req = {};
        }

        /** 把所有 ObjectId 字符串 转为 ObjectId对象 */
        if (ctx.req instanceof Array) {
            deepArrayId(ctx.req);
        } else if (isObject(ctx.req)) {
            deepObjectId(ctx.req);
        } else {
            return ctx.req = "错误"
        }

        await next();
    });
}


/*
const koaBody = require('koa-body');
// server.use(koaBody());
// 配置可以上传文件的 koa-body 
const DIR_UPLOAD = path.resolve(process.cwd(), "public/upload/");
server.use(koaBody({
    multipart: true,    // 打开多媒体上传
    formidable: {
        // option里的路径 不推荐使用相对路径， 因为option里的相对路径 不是当前文件的相对路径，而是当前进程 process.cwd()的相对路径。当前脚本在koa2执行
        uploadDir: DIR_UPLOAD, // 上传的文件上传到哪个文件下 
        keepExtensions: true
    }
}));
*/