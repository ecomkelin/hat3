const getPlatData = require("./getPlatData");
const ClientCL = require("../../Models/auth/Client.Model");
const { genAcToken, genReToken, parsePayload } = require(path.resolve(process.cwd(), 'core/crypto/jwt'));

module.exports = async ctx => {
	try {
		const {providerPayload, providerId} = await getPlatData(ctx.reqBody);

		const Client = await ClientCL.COLLECTION.findOne({providerId}) || await addClient(providerId, providerPayload);

		const payload = parsePayload(Client);
        const accessToken = genAcToken(payload);
        const refreshToken = genReToken(payload);

		const data = {
            accessToken,
            refreshToken,
            payload,
			Client
        }

		return ctx.success = data;
	} catch (e) {
		return ctx.fail = e;
	}
}

const addClient = (providerId, providerPayload) => new Promise(async(resolve, reject) => {
	try {
		console.log("addClient: ", providerPayload)
		const at_crt = at_upd = Date.now();
		const document = {
			_id: newObjectId(),
			providerId,
			name: '尊敬的客户',
			is_usable: true,
			sort: 0,
			at_crt,
			at_upd,
		}
		await ClientCL.COLLECTION.insertOne(document);
		return resolve(document);
	} catch(e) {
		console.log("SingWith addClient error: ", e);
		return reject(e);
	}
})