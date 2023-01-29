const jwtMD = require(path.join(process.cwd(), "core/encryption/jwt"));

module.exports = async(ctx, next) => {
	try {
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);

		ctx.payload = payload;
        await next();	// 如果用 await 那么 系统还会再回访 执行 next(); 下面的句子
		// console.info("如果用 await, 那么执行完 下面的中间件 还会调用这句话")		
	} catch(e) {
		ctx.fail = e;
	}
}
/* =============================================== 中间件 =============================================== */
