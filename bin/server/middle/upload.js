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
        let rel_path = '/upload/';                      // 系统文件会放入 upload中
        rel_path += ctx.Koptions.payload.Firm || '_Firm/';       // 首先以公司分文件夹 方便迁移
        rel_path += ctx.reqQuery.dir || '_db/';         // 手动分文件夹 如果前端不给 则自动分配到 _db 文件夹中
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        rel_path += year + '_' + month + '_' + day + '/';        // 再以每天分文件夹
            // 最后一个 /符号 可以加也可以不加 都可以 系统会按文件夹 处理。 如果不加 注意 要在拼接 图片相对位置时加上
        const uploadDir = DIR_PUBLIC + rel_path;

        /** 如果没有文件夹 则自动创建 */
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {
                recursive: true
            })
        }

        /** 如果要手动命名文件名称 如果是多文件上传 最好不要手动命名 所以这就不用了 写在这 作为了解*/
        let filename;
        if(ctx.reqQuery.filename) {
            /** 必须返回 return String 否则报错 */
            filename = (name, ext, part, form) => {
                // console.info("原文件名称 无后缀名", name);
                // console.info("原文件后缀名", ext);
                // console.info("数据流", part);
                // // console.info("444 form", form);
                // console.info("------------------------")
                return ctx.reqQuery.filename + ext;
            };
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
                return mimetype && mimetype.includes("image");
            },
            // filename
        });

        form.parse(ctx.req, (err, fields, files) => {
            if (err) return reject(err);
            try {
                ctx.reqBody = JSON.parse(fields.body);
            } catch (error) {
                return reject("upload 前端的 form-data fields中要有 body字段, 并且是JSON string类型");
            }
            let keys = Object.keys(files);
            // console.log(111, keys);
            keys.forEach(key => {
                // console.log(files[key].newFilename)
                // console.log(files[key].filepath)
                // console.log(files[key].originalFilename)
                // console.log(files[key].mimetype)
                // console.log(files[key].size)
                let rel_file = rel_path+files[key].newFilename;
                let ks = key.split("_");
                if(ks.length === 1) {
                    ctx.reqBody[key] = rel_file;
                } else if(ks.length === 2) {
                    if(!ctx.reqBody[ks[0]]) ctx.reqBody[ks[0]] = []
                    ctx.reqBody[ks[0]][ks[1]] = rel_file;
                }
                // ctx.reqBody
            })
            console.log(111, ctx.reqBody);
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
            const payload = ctx.Koptions.payload;
            if (!payload) return ctx.fail = { status: 401, errMsg: "您没有此权限" };

            await formParse(ctx);
            console.log(111)
            return next();
        }

        return next();
    } catch (e) {
        return ctx.fail = e;
    }
}