let ClientCL;
module.exports = async (ctx) => {
    try {
        if (!ClientCL) ClientCL = require("../../Models/auth/Client.Model");
        const { reqBody, Koptions: { payload } } = ctx;
        if (!isObjectIdAbs(payload._id)) throw "登录信息错误";
        let update = reqBody.update;

        /** 解析 update */
        update = updateParse(update);

        const match = { _id: payload._id };
        await ClientCL.COLLECTION.updateOne(match, update);

        const object = await ClientCL.COLLECTION.findOne(match);
        if (!object) throw "更新个人信息时 数据库中找不到此用户"
        // console.log(1111, object);
        return ctx.success = { object };
    } catch (e) {
        return ctx.fail = e;
    }
}

const updateParse = (update) => {
    try {
        if (!isObject(update)) throw "请传递 update";

        /** 解开 中间件 */
        let setObj = update["$set"];
        
        for(let key in setObj) {
            if(key[0] === '$') {
                update = setObj;
                break;
            }
        }

        /** 修改名称 */
        if (isObject(update["$set"])) {
            const updSet = {};
            if (update["$set"].name) updSet.name = update["$set"].name;
            if (update["$set"].tel) updSet.tel = update["$set"].tel;
            if (update["$set"].city) updSet.city = update["$set"].city;
            if (update["$set"].addr) updSet.addr = update["$set"].addr;
            if (update["$set"].bell) updSet.bell = update["$set"].bell;
            if (update["$set"].note) updSet.note = update["$set"].note;

            if (Object.keys(updSet).length === 0) throw "请传递要修改的值";
            update = { "$set": updSet };
        }
        /** 添加新的地址 */
        else if (isObject(update["$push"])) {
            const shipsPush = update["$push"].ships;
            if (!isObject(shipsPush)) throw "请传递 运输地址信息";
            const ship = {};
            ship._id = newObjectId();
            ship.name = shipsPush.name;
            if (!ship.name) throw "请传递 收货人名字"
            ship.tel = shipsPush.tel;
            if (!ship.tel) throw "请传递 收货人电话"
            ship.city = shipsPush.city;
            if (!ship.city) throw "请传递 收货人城市"
            ship.addr = shipsPush.addr;
            if (!ship.addr) throw "请传递 收货人地址"
            ship.bell = shipsPush.bell;
            ship.note = shipsPush.note;

            update = { "$push": { ships: { "$each": [ship], "$position": 0, "$slice": 5 } } };
        }
        /** 删除 */
        else if(update["$pull"]) {
            const shipsPull = update["$pull"].ships;
            if (!isObject(shipsPull)) throw "正确的参数 update['$pull'].ships 为对象";
            update = {"$pull": {ships: shipsPull}}
        }
        /** 否则错误 */
        else {
            throw "update 参数传递错误"
        }
        return update;
    } catch (e) {
        throw e;
    }
}