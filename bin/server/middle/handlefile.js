const uploadFiles = require("./handlefile/uploadFiles");
const removeFiles = require("./handlefile/removeFiles");
module.exports = async (ctx, next) => {
    try {
        /** 前台给足条件 才会进入文件上传处理  否则直接查看之后的组件*/
        if (passUpload(ctx)) await uploadFiles(ctx);
    } catch (e) {
        /** 告诉系统已经错误 即便后面代码给ctx挂载了success
         * 最后也会读取到 ctx.fail 执行的是 ctx.fail
         * 另外 这不能return 如果return的话 已经上传的图片就失去了根源无法删除
         */
        ctx.fail = e;
    }


    /** 一定要用 finally
     * 否则 万一 图片上传后 参数在 upload 中间件出错 
     * 那么图片就无法自动删除了
     */
    finally {
        /** 等待系统处理 下面的中间件 */
        await next();


        /** 删除 待删除图片 */
        removeFiles(ctx.Koptions.handleFiles);

        /** 为了验证 错误时 是上传后 自动删除了图片 而不是没上传 */
        // setTimeout(() => {
        //     removeFiles(ctx.Koptions.handleFiles);
        // }, 2000)
    }
}


/** 一个笼统的判断 是否能够上传图片， 做了这个验证会更好， 如果不做验证 后面做验证 图片也已经上传上来了 */
const passUpload = (ctx) => {
    /** 前端 的 路由路径 必须包含  insertOne 或者 updateOne 才有资格上传图片 */
    if (!ctx.url.toLowerCase().includes('insertone') && !ctx.url.toLowerCase().includes('updateone')) return false
    /** 前端 的 query 必须给 passUpload=1 才有机会通过 */
    if (ctx.request.query.passUpload != 1) return false;
    return true;
}