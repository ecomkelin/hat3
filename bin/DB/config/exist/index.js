/** 
 * 新增 或 插入之前 先检查数据库 能否加入新的数据
 * 检查 数据库中是否存在此 数据
 * 在 数据库方法 insert/update One/Many 
 */
 module.exports = (ctxObj, MToptions) => new Promise(async(resolve, reject) => {
	try {
		const {reqBody = {}} = ctxObj
		const {document, update} = reqBody;
		const {CLdoc, COLLECTION, pass_exist} = MToptions;

		let match = null;

		let is_upd = document ? false : true;
		let docObj = null;
		if(is_upd) {
			if(!isObject(update)) return reject("exist 请传递 update 或 document 对象")
			docObj = update["$set"];
			/** filter 在regulateReq中被删除了 _id 被放到了 match里面 */
			if(!reqBody.match || !isObjectIdAbs(reqBody.match._id) ) return reject("exist 请传递  ObjectId 类型的 match._id")
			match = {_id: {"$ne": reqBody.match._id}};
		} else {
			if(!isObject(document)) return reject("exist document 必须为 对象");
			docObj = document;
		}


		let matchOr = [];			// 初始化field唯一的参数
		for(let key in CLdoc) {		// 循环文档中的每个field
			if(is_upd && !docObj[key]) continue;	// 如果是更新文档 对于不更改的值 则可以忽略不判断;

			let param = {};
			if(CLdoc[key].unique) {									// 判断field是否为unique 如果是unique 则不需要判断其他的
				param[key] = docObj[key];
			} else if(CLdoc[key].uniq) {
				let uniq = CLdoc[key].uniq;		// 查看数据库模型中 field 的 uniq标识	比如 公司中员工账号唯一 code.uniq = ["Firm"]
				if(!(uniq instanceof Array)) return reject(`writeExist 数据库 CLdoc 的uniq值错误`);
				param[key] = docObj[key];			// 相当于 {code: '员工编号'}
				for(let i=0; i<uniq.length; i++) {
					let sKey = uniq[i];
					if(docObj[sKey] === undefined) return reject(`writeExist 请传递 在新的 doc中传递 [${key}] 的值`);
					param[sKey] = docObj[sKey];
				}
				// 循环下来 
				// {code: "001", Firm: "FirmId"} xd公司中是否有 001这个员工编号
				// 折扣编号 {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
			} else if(CLdoc[key].true_unique && docObj[key] === true) {
				// 查看数据库模型中 field 的 true_unique 标识 本文档中 只能有一个为真的数据
				param[key] = docObj[key];			// 相当于 {is_admin: '是否为超级用户'}
			} else if(CLdoc[key].true_uniq && docObj[key] === true) {
				// 查看数据库模型中 field 的 true_uniq标识	
				//比如 公司中员工账号唯一 is_default.true_uniq = ["Firm"] 整个公司只能有一个用户 的 is_default 为true
				let true_uniq = CLdoc[key].true_uniq;	
				if(!(true_uniq instanceof Array)) return reject(`writeExist 数据库 CLdoc 的true_uniq值错误`);
				param[key] = docObj[key];			// 相当于 {is_default: '是否为默认数据'}
				for(let i=0; i<true_uniq.length; i++) {
					let sKey = true_uniq[i];
					if(docObj[sKey] === undefined) continue;
					param[sKey] = docObj[sKey];		// 相当于 {Firm: 'FirmId'}
				}
				// 循环下来 
				// {is_default: true, Firm: "FirmId"} xd公司中是否有 001这个员工编号
			}
			if(Object.keys(param).length > 0) matchOr.push(param);
		}

		if(matchOr.length === 0) {	// 根据 模型  不存在查询条件
			if(pass_exist) return reject("没有此条件的 数据")
			else return resolve(null)
		}

		match ? match["$or"] = matchOr: match = {"$or": matchOr};
		const data = await COLLECTION.findOne(match);
		if(pass_exist) return data ? resolve(data) : reject("数据库中 没有此数据")
		else return data ? reject("已经存在此数据") : resolve(null);

	} catch(e) {
		return reject(e);
	}
})