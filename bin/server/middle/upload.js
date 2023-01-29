const fs = require("fs");

const formidable = require('formidable');
const DIR_PUBLIC = path.resolve(process.cwd(), "public/");

/** 给server 增加一个中间件
 * uploadDir  // 配置项的一个参数
 *          要上传的文件 被传到哪个路径文件下 不推荐使用相对路径，而是绝对路径 
 *              绝对路径为 path.resolve(process.cwd(), "public/upload/");
 *              还有另外一种写法 为 path.join(__dirname, "../../../public/upload");
 *          因为里的相对路径 不是当前文件的相对路径，而是当前进程的相对路径。当前脚本在koa2执行
 *              也就是说如果用相对路径 就要 process.cwd() 这个的相对路径 就是 "./public/upload/"
 */


const formParse = ctx => new Promise((resolve, reject) => {
    try {
        /** 根据前端数据 存储文件 位置及名称 */
        // ctx.reqQuery

        /** 文件要上传的位置 */
        let rel_path = '/upload/';

        const uploadDir = DIR_PUBLIC + rel_path;  // 最后一个 / 可以加也可以不加 都可以

        /** 如果要重新文件名称 */
        let fileName = "testName";

        /** 如果没有文件夹 则自动创建 */
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {
                recursive: true
            })
        }

        const form = formidable({
            multiples: true,            // 暂时先放着， 因为做了实验 数据跟此配置项没有任何关系
            keepExtensions: true,       // 如果没有这么配置 则一定不会有后缀。即便使用 filename 返回含有后缀名的字符串 这个选项也要打开 不然会丢失后缀
            uploadDir,                  // 要上传的位置
            maxFileSize: 10 * 1024 * 1024,        // 文件大小
            filter: ({ name, originalFilename, mimetype }) => {
                // console.info("前端传递的 files[name] 的name", name);
                // console.info("前端传递的原文件 名称", originalFilename);
                // console.info("前端传递文件的 类型 不是后缀", mimetype);

                /** 如果返回真 则把文件通过上传 否则不会上传到服务器 */
                // return mimetype && mimetype.includes("image");
                return true
            },
            /** 必须返回 string */
            // filename: function (name, ext, part, form) {
            //     console.info("原文件名称 无后缀名", name);
            //     console.info("原文件后缀名", ext);
            //     console.info("数据流", part);
            //     // console.info("444 form", form);
            //     console.info("------------------------")
            //     return fileName+ext;
            // },

        });
        form.parse(ctx.req, (err, fields, files) => {
            if (err) return reject(err);
            try {
                ctx.reqBody = JSON.parse(fields.body);
            } catch (error) {
                return reject("upload 前端的 form-data fields中要有 body字段, 并且是JSON string类型");
            }
            console.log(files)
            return resolve();
        });
    } catch (e) {
        return reject(e);
    }
});



module.exports = async (ctx, next) => {
    try {
        /** 前端 的 query 必须给 upload=1 才可以上传图片 */
        if (['post', 'put'].includes(ctx.method.toLowerCase()) && ctx.reqQuery.upload == 1) {

            /** 判断是否有权限 */
            const payload = ctx.payload;
            if(!payload) return ctx.fail = {status: 401, errMsg: "您没有此权限"};

            await formParse(ctx);

            return next();
        }

        return  next();
    } catch (e) {
        return ctx.fail = e;
    }
}