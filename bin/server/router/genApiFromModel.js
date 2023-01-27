module.exports = (CLmodel, fileName, newRoute) => {
    restfulMethod = "post"   // 统一做 post 处理
    const { GenRoute } = CLmodel.CLoptions;
    if (!GenRoute) return;

    let urlPre = "/generate/" + fileName + "/"

    Object.keys(GenRoute).forEach(url => {
        newRoute(restfulMethod, urlPre + url, async ctx => {
            try {
                const payload = ctx.request.payload;
                if(ctx.request.query.showApi == 1) return resAPI(ctx, GenRoute[url].api);
                /** 限制 是否通过 */
                if (GenRoute[url].restrict) {
                    return resNOACCESS(ctx);
                }

                const MToptions = { payload };

                const data = await CLmodel[url](ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
            } catch (e) {
                return resERR(ctx, e);
            }
        })
    })
}


/**
            if (url === 'countDocuments') {
                const count = await CLmodel.countDocuments(ctx.req, MToptions);
                return resSUCCESS(ctx, { data:{count} });
             } else if (url === 'find') {
                const objects = await CLmodel.find(ctx.req, MToptions);
                return resSUCCESS(ctx, { data:{objects} });
             } else if (url === 'findOne') {
                const object = await CLmodel.findOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data:{object} });
             } else if (url === 'deleteMany') {
                const deletedObj = await CLmodel.deleteMany(ctx.req, MToptions);
                return resSUCCESS(ctx, { data: {deletedObj} });
             } else if (url === 'deleteOne') {
                const deletedObj = await CLmodel.deleteOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data: {deletedObj} });
             } else if (url === 'insertMany') {
                const data = await CLmodel.insertMany(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if (url === 'insertOne') {
                const data = await CLmodel.insertOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if (url === 'updateMany') {
                const data = await CLmodel.updateMany(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if (url === 'updateOne') {
                const data = await CLmodel.updateOne(ctx.req, MToptions);
                return resSUCCESS(ctx, { data });
             } else if(url === 'indexes') {
                const data = await CLmodel.indexes();
                return resSUCCESS(ctx, { data });
             }
 */