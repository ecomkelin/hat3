const UserCL = require("../../Models/auth/User.Model");

module.exports = async ctx => {
    try {        
        let data = await UserCL.insertOne(ctx.reqBody,{payload: 1, CLoptions: {writeConcer: "majority"}});
        return ctx.success = {data};
    } catch(e) {
        return ctx.fail = e;
    }
}