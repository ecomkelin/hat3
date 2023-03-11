const thumbnail = require(path.resolve(process.cwd(), 'core/image/thumbnail'));

/** 整理文件
 * 1 压缩图片
 * 2 把生成的文件路径 放入相应的 集合字段中
 */
const collationFile = (ctx, file, field, obj, rel_path) => new Promise(async (resolve, reject) => {
    try {

        let rel_file = rel_path + file.newFilename;

        /** 生成 缩略图 */
        await thumbnail(rel_file, rel_path);

        /** 根据前端描述 确定字段是数组还是字符串 */
        if (ctx.Koptions.flagArrs.includes(field)) {
            if (!obj[field]) obj[field] = [];
            obj[field].push(rel_file);
        } else {
            obj[field] = rel_file;
            ctx.Koptions.flagStrs.push(field)
        }
        /** 之前的笨办法 用下划线 _ 来标记数组 */
        // let ks = field.split("_");
        // if (ks.length === 1) {
        //     obj[field] = rel_file;
        // } else if (ks.length === 2) {
        //     if (!obj[ks[0]]) obj[ks[0]] = []
        //     obj[ks[0]][ks[1]] = rel_file;
        // }

        /** 暂时先把新图片放入 待删除文件中 如果数据库保存成功 则使用 delete ctx.Koptions.handleFiles */
        ctx.Koptions.handleFiles.push(rel_file);
        return resolve();
    } catch (e) {
        return reject(e);
    }
})

module.exports = (ctx, form, rel_path) => new Promise(async (resolve, reject) => {
    try {
        form.parse(ctx.req, async (err, fields, files) => {
            if (err) return reject(err);
            let errMsg = null;
            try {
                /** 先处理 body */
                ctx.request.body = JSON.parse(fields.body);
            } catch (error) {
                ctx.request.body = {};
                errMsg = "upload 前端的 form-data fields中要有 body字段, 并且是JSON string类型";
            }
            /** 分辨是 insertOne 还是 updateOne */
            const { document, update, flagArrs = [] } = ctx.request.body;

            let obj = document;
            if (update) obj = update["$set"] || update;

            /** 保证 obj 一定要是对象 不然如果在此出错 图片就不会被删除 有错误 进行完 handleFiles 再处理*/
            if (!isObject(obj)) {
                errMsg = "upload 您必须给 form-data 对象传递 document / update 对象";
                obj = {};
            }

            ctx.Koptions.flagArrs = flagArrs;
            ctx.Koptions.flagStrs = [];

            /** 根据解析的 文件进行数据操作 */
            let keys = Object.keys(files);
            for (let i in keys) {
                let field = keys[i];
                let parseFiles = files[field];  // 找到要解析的文件对象
                
                /** 统一处理 因为前端 有可能 给的 file字段相同就会出现数组 */
                if (!(parseFiles instanceof Array)) parseFiles = [parseFiles];

                for (let j in parseFiles) {
                    let file = parseFiles[j];
                    // console.info(file.newFilename)
                    // console.info(file.filepath)
                    // console.info(file.originalFilename)
                    // console.info(file.mimetype)
                    // console.info(file.size)
                    await collationFile(ctx, file, field, obj, rel_path);
                }
            }
            if (errMsg) return reject(errMsg);
            return resolve();
        });
    } catch (e) {
        return reject(e);
    }
})