/* =============================================== 中间件 =============================================== */
const jwtMD = require(path.join(process.cwd(), "core/encryption/jwt"));
/**
 * 权限中间件
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns [Function] next() | resNOACCESS(ctx)
 */
module.exports = async(ctx, next) => {
	try {
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);
		ctx.request.payload = payload;

        return next();
		
	} catch(e) {
		return resERR(ctx, e, next);
	}
}
/* =============================================== 中间件 =============================================== */
