const fs = require("fs");
const formidable = require('formidable');

const DIR_PUBLIC = path.resolve(process.cwd(), "public");

/** 一个笼统的判断 是否能够上传图片， 做了这个验证会更好， 如果不做验证 后面做验证 图片也已经上传上来了 */
const passUpload = (ctx) => {
    /** 前端 的 路由路径 必须包含  insertOne 或者 updateOne 才有资格上传图片 */
    if(!ctx.url.toLowerCase().includes('insertone') && !ctx.url.toLowerCase().includes('updateone')) return false
    /** 前端 的 query 必须给 passUpload=1 才有机会通过 */
    if(ctx.request.query.passUpload != 1) return false;
    return true;
}


module.exports = async (ctx, next) => {
    try {
        /** 把将要被删除文件的路径 挂载到 Koptions 上去 */
        ctx.Koptions.handleFiles = [];
        ctx.Koptions.will_handleFiles = [];
        if(passUpload(ctx)) await uploadFiles(ctx);
        /** 等待系统处理 下面的中间件 */
    } catch (e) {
        ctx.fail = e;
    } 
    /** 一定要用 finally
     * 否则 万一 图片上传后 参数在 upload 中间件出错 
     * 那么图片就无法自动删除了
     */
    finally {
        await next();

        /** 删除 待删除图片 */
        rmFile(ctx.Koptions.handleFiles);

        // setTimeout(() => {
        //     rmFile(ctx.Koptions.handleFiles);
        // }, 2000)
    }
}

/** 删除图片 */
const rmFile = (handleFiles) => {
    if(handleFiles instanceof Array) {
        for (let i=0; i<handleFiles.length; i++) {
            let delFile = handleFiles[i];
            fs.unlink(DIR_PUBLIC+delFile, (err) => {
                if(err) {
                    console.error("删除图片失败", err);
                } else {
                    console.info("已删除图片: ", DIR_PUBLIC + delFile);
                }
            });
        }
    }
}


const formParse = (ctx, form, rel_path) => new Promise(async (resolve, reject) => {
    try {
        form.parse(ctx.req, (err, fields, files) => {
            if (err) return reject(err);
            let errMsg = null;

            try {
                ctx.request.body = JSON.parse(fields.body);
            } catch (error) {
                ctx.request.body = {};
                errMsg = "upload 前端的 form-data fields中要有 body字段, 并且是JSON string类型";
            }
            /** 分辨是 insertOne 还是 updateOne */
            const {document, update, flagArrs=[]} = ctx.request.body;

            let obj = document;
            if(update) obj = update["$set"] || update;

            /** 保证 obj 一定要是对象 不然如果在此出错 图片就不会被删除 有错误 进行完 handleFiles 再处理*/
            if(!isObject(obj)) {
                errMsg = "upload 您必须给 form-data 对象传递 document / update 对象";
                obj = {};
            }

            ctx.Koptions.flagArrs = flagArrs;
            ctx.Koptions.flagStrs = [];

            /** 根据解析的 文件进行数据操作 */
            let keys = Object.keys(files);
            for (let i in keys) {
                let key = keys[i];
                let parseFiles = files[key];
                /** 统一处理 因为前端 有可能 给的 file字段相同就会出现数组 */
                if(!(parseFiles instanceof Array)) parseFiles = [parseFiles];
                for(let j in parseFiles) {
                    let file = parseFiles[j];
                    // console.info(file.newFilename)
                    // console.info(file.filepath)
                    // console.info(file.originalFilename)
                    // console.info(file.mimetype)
                    // console.info(file.size)
                    let rel_file = rel_path + file.newFilename;

                    /** 根据前端描述 确定字段是数组还是字符串 */
                    if(flagArrs.includes(key)) {
                        if(!obj[key]) obj[key] = [];
                        obj[key].push(rel_file);
                    } else {
                        obj[key] = rel_file;
                        ctx.Koptions.flagStrs.push(key)
                    }
                    /** 之前的笨办法 用下划线 _ 来标记数组 */
                    // let ks = key.split("_");
                    // if (ks.length === 1) {
                    //     obj[key] = rel_file;
                    // } else if (ks.length === 2) {
                    //     if (!obj[ks[0]]) obj[ks[0]] = []
                    //     obj[ks[0]][ks[1]] = rel_file;
                    // }
    
                    /** 暂时先把新图片放入 待删除文件中 如果数据库保存成功 则使用 delete ctx.Koptions.handleFiles */
                    ctx.Koptions.handleFiles.push(rel_file);
                }
            }
            if(errMsg) return reject(errMsg);
            return resolve();
        });
    } catch (e) {
        return reject(e);
    }
})
const uploadFiles = ctx => new Promise(async (resolve, reject) => {
    try {
        /** 判断是否有权限 */
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
        await formParse(ctx, form, rel_path);

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
    if(ctx.request.query.dirs) {                                 // 手动分文件夹
        let dirs = ctx.request.query.dirs;
        if(dirs instanceof Array) {
            dirs.forEach(dir=> rel_path += dir+'/')
        } else if(typeof dirs === 'string') {
            rel_path += dirs+'/';         
        }
    }
    if(ctx.request.query.dirDate == 1) {            // 如果 需要加入 日期文件夹
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