const UserCL = require("../../../src/Models/auth/User.Model");
module.exports = (router) => {
    router.get('/initAdmin', async ctx => {
        try {
            const { code = "admin", pwd = "111111", role = "10" } = ctx.request.query;
            let data = await UserCL.COLLECTION.findOne({ code });
            if (data) return ctx.success = { data }
            ctx.reqBody.document = {
                code,
                pwd,
                role
            }
            await UserCL.insertOne(ctx);
            ctx.success = "success"
        } catch (e) {
            ctx.fail = e
        }
    })
}
