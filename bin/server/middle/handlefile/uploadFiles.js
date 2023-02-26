const fs = require("fs");
const formidable = require('formidable');
const parseFiles = require("./parseFiles");

module.exports = ctx => new Promise(async (resolve, reject) => {
    try {
        /** 判断是否有权限 不能放在 是否通过上  是否通过不会报错，如果不满足条件 直接执行后续步骤 */
        const payload = ctx.Koptions.payload;
        if (!payload) return reject({ status: 401, errMsg: "无权上传图片" });

        /** 根据payload 前端制定文件夹 和日期 决定存储文件 位置及 */
        const { rel_path, uploadDir } = get_paths(ctx);

        /** 如果要手动命名文件名称 如果是多文件上传 最好不要手动命名 所以这就不用了 写在这 作为了解*/
        // let filename = get_filename(ctx.request.query.filename);

        const form = formidable({
            multiples: true,            // 暂时先放着， 因为做了实验 数据跟此配置项没有任何关系
            keepExtensions: true,       // 如果没有这么配置 则一定不会有后缀。即便使用 filename 返回含有后缀名的字符串 这个选项也要打开 不然会丢失后缀
            uploadDir,                  // 要上传的位置
            maxFileSize: 10 * 1024 * 1024,        // 文件大小
            filter,
            // filename,        // 建议不要更改文件名称 可以给其加文件夹
        });
        await parseFiles(ctx, form, rel_path);

        return resolve()
    } catch (e) {
        return reject(e);
    }
})













/** 给server 增加一个中间件
 * uploadDir  // 配置项的一个参数
 *          要上传的文件 被传到哪个路径文件下 不推荐使用相对路径，而是绝对路径 
 *              绝对路径为 path.resolve(process.cwd(), "public/upload/");
 *              还有另外一种写法 为 path.join(__dirname, "../../../public/upload");
 *          因为里的相对路径 不是当前文件的相对路径，而是当前进程的相对路径。当前脚本在koa2执行
 *              也就是说如果用相对路径 就要 process.cwd() 这个的相对路径 就是 "./public/upload/"
 */

const get_paths = ctx => {
    /** 文件要上传的 相对位置 */
    let rel_path = '/upload/';                              // 系统文件会放入 upload中
    rel_path += ctx.Koptions.payload.Firm || '_Firm/';       // 首先以公司分文件夹 方便迁移
    if (ctx.request.query.dirs) {                                 // 手动分文件夹
        let dirs = ctx.request.query.dirs;
        if (dirs instanceof Array) {
            dirs.forEach(dir => rel_path += dir + '/')
        } else if (typeof dirs === 'string') {
            rel_path += dirs + '/';
        }
    }
    if (ctx.request.query.dirDate == 1) {            // 如果 需要加入 日期文件夹
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        rel_path += year + '_' + month + '_' + day + '/';        // 再以每天分文件夹
    }
    // 最后一个 /符号 可以加也可以不加 都可以 系统会按文件夹 处理。 如果不加 注意 要在拼接 图片相对位置时加上

    /** 文件要被上传的 绝对位置 */
    const uploadDir = DIR_PUBLIC + rel_path;
    /** 如果没有文件夹 则自动创建 */
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
            recursive: true // 如果是深度文件夹 则循环创建
        })
    }

    return { rel_path, uploadDir };
}

const get_filename = fname => {
    if (fname) {
        return (name, ext, part, form) => {
            // console.info("原文件名称 无后缀名", name);
            // console.info("原文件后缀名", ext);
            // console.info("数据流", part);
            // // console.info("444 form", form);
            // console.info("------------------------")
            /** 必须返回 return String 否则报错 */
            return fname + ext;
        };
    }
    /** 如果 前端没有给此值 则不返回 */
}

const filter = ({ name, originalFilename, mimetype }) => {
    // console.info("前端传递的 files[name] 的name", name);
    // console.info("前端传递的原文件 名称", originalFilename);
    // console.info("前端传递文件的 类型 不是后缀", mimetype);

    /** 如果返回真 则把文件通过上传 否则不会上传到服务器 */
    return mimetype && mimetype.includes("image");
    // return true
};