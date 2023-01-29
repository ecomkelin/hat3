const CLmodel_User = require("../../Models/auth/User.Model");

exports.get_find = async ctx => {
    try {
        const payload = ctx.Koptions.payload;
        let data = await CLmodel_User.find(ctx.reqBody, {payload});

        return ctx.success = {data};
    } catch(e) {
        return ctx.fail = e;
    }
}

exports.post_find = async ctx => {
    try {
        const payload = ctx.Koptions.payload;
        let data = await CLmodel_User.find(ctx.reqBody, {payload});

        return ctx.success = {data};
    } catch(e) {
        return ctx.fail = e;
    }
}

exports.get_deleteOne = async ctx => {

}