/** 超级管理员 添加新的用户 */
exports.insertOne = async ctx => {
    try {
        const payload = ctx.Koptions.payload;
        if(!payload.role || payload.role > 9) return ctx.fail = {status: 401}
        ctx.success = "helo"
    } catch(e) {
        ctx.fail = e;
    }
}