const UserCL = require("../../Models/User.Model");

module.exports = async ctx => {
    try {        
        let data = await UserCL.insertOne(ctx.req,{payload: 1, CLoptions: {writeConcer: "majority"}});
        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}