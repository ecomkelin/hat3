let PdCL;

exports.countDocuments = {}
exports.findOne = {}
exports.find = {}

exports.insertOne = {
    roles: role_pder,
    execCB: async ({ reqBody = {} }) => {
        try {
            if (!PdCL) PdCL = require("./Pd.Model");
            const { document = {} } = reqBody;
            if (!isObjectIdAbs(document.Pd)) throw "必须传递 Pd的 ObjectId";
            let query = { _id: document.Pd }
            const Pd = await PdCL.COLLECTION.findOne(query)
            if (!Pd) throw "无法找到 Pd";
            if (!(Pd.AttrPds instanceof Array)) Pd.AttrPds = [];
            const AttrPds = Pd.AttrPds;
            AttrPds.push(document._id);
            await PdCL.COLLECTION.updateOne(query, { "$set": { AttrPds } })
        } catch (e) {
            throw "插入AttkPd时, " + e;
        }
    }
}

// exports.insertMany= { roles: role_pder };
updateOne: { roles: role_pder };
exports.updateMany = { roles: role_pder };
exports.deleteOne = {
    roles: role_pder,
    execCB: async ({ reqBody = {}, Koptions = {} }) => {
        try {
            if (!PdCL) PdCL = require("./Pd.Model");
            const { object } = Koptions;
            if (!isObjectIdAbs(object.Pd)) throw "找不到 AttkPd 下的 Pd ObjectId";
            let query = { _id: object.Pd }
            const Pd = await PdCL.COLLECTION.findOne(query)
            if (!Pd) throw "无法找到 Pd";
            if (!(Pd.AttrPds instanceof Array)) Pd.AttrPds = [];
            const AttrPds = Pd.AttrPds;

            let i = 0;
            for (; i < AttrPds.length; i++) {
                if (String(AttrPds[i]) === String(object._id)) break;
            }
            if (i < AttrPds.length) {
                AttrPds.splice(i, 1);
            }

            await PdCL.COLLECTION.updateOne(query, { "$set": { AttrPds } })

        } catch (e) {
            throw "插入AttkPd时, " + e;
        }
    }
}

exports.deleteMany = { roles: role_pder }