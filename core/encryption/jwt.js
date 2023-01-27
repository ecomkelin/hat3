const jsonwebtoken = require('jsonwebtoken');

/**
 * 根据 headers 中的 bear token 截取要使用的token
 * @param {String} headersToken bear空格token
 * @returns [String] token
 */
exports.obtToken_fromHeaders = (headersToken) => {
	if(!headersToken) return null;
	let hts = String(headersToken).split(" ");
	if(hts.length === 1) return null;
	else if(hts.length > 1) return hts[1];
}

/**
 * 根据token 获取 payload
 * @param {String} headersToken 接收 headers 中的 bear token
 * @param {Boolean} is_refresh 是否为 refresh
 * @returns [Object] payload
 */
exports.obtainPayload_Pobj = (headersToken, is_refresh)=> new Promise(async(resolve, reject) => {
	try {
		let token = this.obtToken_fromHeaders(headersToken);
		if(!token) return resolve({});	// 如果没有token 则返回空 payload, 不妨碍无权限的验证
		let token_secret = is_refresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
		jsonwebtoken.verify(token, token_secret, (expired, payload) => {
			if(expired) return reject({status: 401, errMsg: "token错误或过期", expired});
			return resolve(payload);
		})
	} catch(e) {
		return reject(e);
	}
})


/**
 * 根据 payload 生成 token
 * @param {Object} payload 根据payload对象生成token
 * @param {Boolean} is_refresh 是否为refresh
 * @returns [String] token
 */
exports.generateToken = (payload, is_refresh=null)=> {
	let token_secret = is_refresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
	let token_ex = is_refresh ? REFRESH_TOKEN_EX : ACCESS_TOKEN_EX;
	return jsonwebtoken.sign(payload, token_secret, {expiresIn: token_ex});
}

/**
 * 根据 对象 obj 生成 payload
 * @param {Object} obj 根据obj生成 payload
 * @returns [Object] payload
 */
exports.generatePayload = (obj)=> {
	let payload = {};
	if(obj._id) payload._id = obj._id;
	if(obj.code) payload.code = obj.code;
	if(obj.nome) payload.nome = obj.nome;
	if(obj.phone) payload.phone = obj.phone;
	if(obj.email) payload.email = obj.email;
	
	if(obj.Firm) payload.Firm = obj.Firm;

	if(obj.type_auth === 'User') {
		payload.type_auth = obj.type_auth;
		payload.rankNum = obj.rankNum;
		payload.is_admin = obj.is_admin;
		payload.auths = [];
		for(let i=0; i<obj.auths.length; i++) {
			let auth = obj.auths[i].toLowerCase();
			if(!payload.auths.includes(auth)) payload.auths.push(auth);
		}
		for(let i=0; i<obj.Roles.length; i++) {
			let Role = obj.Roles[i];
			for(let j=0; j<Role.auths.length; j++) {
				let auth = Role.auths[j].toLowerCase();
				if(!payload.auths.includes(auth)) payload.auths.push(auth);
			}
		}
	}

	return payload;
}