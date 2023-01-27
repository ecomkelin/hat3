/* ======================================== response ======================================== */
const getRequest = (ctx) => {
    return {
        ip: ctx.request.ip,
        ips: ctx.request.ips,
        subdomains: ctx.request.subdomains,
        method: ctx.request.method,
        // originalUrl: ctx.request.originalUrl,  // 同url
        // origin: ctx.request.origin,      // http://localhost:8000

        protocol: ctx.request.protocol,
        secure: ctx.request.secure,      // 是否为https
        // hostname: ctx.request.hostname,  // localhost
        // host: ctx.request.host,          // localhost:8000
        url: ctx.request.url,
        href: ctx.request.href,
        // type: ctx.request.type,          // "image/png"
        // charset: ctx.request.charset,          // "utf-8"
        path: ctx.request.path,
        querystring: ctx.request.querystring,
        // query: ctx.request.query,           // 格式化后的 query 这个会在req里面写过滤后的 query
        // search: ctx.request.search,
        header: ctx.request.header,
        body: ctx.request.body
        // headers: ctx.request.headers,

        // is2: ctx.is, // => 'html'
        // is_html: ctx.is('html'), // => 'html'
        // is_textHtml: ctx.is('text/html'), // => 'text/html'
        // is_text: ctx.is('text/*', 'text/html'), // => 'text/html'

        // // When Content-Type is application/json
        // is_json: ctx.is('json', 'urlencoded'), // => 'json'
        // is_application: ctx.is('application/json'), // => 'application/json'
        // is_html_application: ctx.is('html', 'application/*'), // => 'application/json'

        // is_image: ctx.is('image/*')
    }
}

/**
 * 数组里的 元素是否全为 ObjectId
 * @param {Object} ctx: 要排序的数组
 * @param {Object} api: 要排序的数组
* returns [Boolean]
 */
resAPI = (ctx, api, next) => {
    ctx.status = 201;
    ctx.body = { status: 201, api };

    if (next) next();
}


resNOACCESS = (ctx, next) => {
    ctx.status = 401;
    ctx.body = { status: 401, errMsg: `您没有访问 [${ctx.url}] 的权限` };

    if (next) next();
}


resSUCCESS = (ctx, ctxBody, next) => {
    ctx.status = 200;

    ctx.body = { status: 200, ...ctxBody, request: getRequest(ctx) };

    if (next) next();
}


resERR = (ctx, e, next) => {
    let errMsg = e.stack

    if (errMsg) {
        let status = e.status || 500;
        ctx.body = { status, errMsg };
        console.error("[errs] e.stack: ", errMsg);
    } else {
        let status = e.status || 400;
        if (isObject(e) === '[object Object]') {
            ctx.body = { status, ...e };
        } else if (typeof (e) == 'string') {
            ctx.body = { status, errMsg: e };
        } else {
            ctx.body = { status, error: e };
        }

        if (status === 500) console.error("[errs] e: ", e);
    }

    if (next) next();
}