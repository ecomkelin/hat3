const moment = require('moment');

const {obtPayload} = require(path.join(process.cwd(), "core/crypto/jwt"));

module.exports = async (ctx, next) => {

    try {
        /** 程序开始 第一次进入中间件 
         * 本次执行程序的开始时间 并记录开始的时间
        */
        let start = Date.now();
        console.info(moment(start).format("YYYY-MM-DD HH:mm:ss "), `[ ${ctx.method} ] ${ctx.url}`);

        /** 挂载 Koptions 
         * 并把 payload 挂载到 Koptions 上
        */
        ctx.Koptions = {};
        /** 把将要被删除文件的路径 挂载到 Koptions 上去 */
        ctx.Koptions.handleFiles = [];
        ctx.Koptions.will_handleFiles = [];
        /** 把payload挂载到 Koptions上去 */
        const payload = await obtPayload(ctx.request.headers['authorization']);
        ctx.Koptions.payload = payload;

        /** 最后 打印日志 生成时间 */
        let person = 'authorization: ';
        if (payload) {
            let { Firm, code, name, role } = payload;
            if (Firm) person += `[Firm: ${Firm}] `;
            if (code) person += `[code: ${code}] `;
            if (name) person += `[name: ${name}] `;
            if (role) person += `[role ${role}] `;
        } else {
            person += "noPayload"
        }
        console.info(person);


        /** 开始等待执行下面的 中间件 及 路由 */
        await next();
        /** 执行完毕中间件 路由执行函数 会给ctx 挂载返回值 */


        /** 根据ctx挂载的返回值 生成 ctx.body */
        if (IS_DEV) request = getRequest(ctx);   // 开发环境 返回前端 请求数据
        if (ctx.fail) fail(ctx);                // 如果不能得到数据
        else if (ctx.success) success(ctx);      // 成功从后端获得数据
        else if (!ctx.body) {
            ctx.status = 405;
            ctx.body = {
                status: 405,
                steps: [`首先检查: 是否有此 [ ${ctx.url} ] 路由`, "如果路由没有问题 那么 此路由没有写body 请联系管理员"]
            }
        }


        let end = Date.now();
        let ms = end - start;
        console.info(ctx.status, `用时: ${ms}ms \n`);
    } catch (e) {
        ctx.fail = e;
        fail(ctx);
    }
}

/** 返回给前端 */
let request;
const fail = ctx => {
    let fail = ctx.fail;
    /** 服务器错误 */
    if (fail.stack) {
        ctx.status = 500;
        ctx.body = { status: 500, server_error: fail.stack }
    }

    /** 前端的参数错误 */
    else if (isObject(fail)) {     // 错误信息给的是对象
        let status = 400;
        if (fail.status) {     // 自定义错误状态
            status = fail.status;
            delete fail.status;
        }

        /** 如果自定义状态为 401 则为 无权限 */
        let noAuth;
        if (status === 401) {
            noAuth = "您没有权限"
        }

        ctx.status = status;
        ctx.body = { status, noAuth, fail };
    } else {        // 错误信息给的是字符串
        ctx.status = 400;
        ctx.body = { status: 400, fail };
    }
}

const success = ctx => {
    const success = ctx.success;
    ctx.status = 200;
    ctx.body = { status: 200, success, request };
}

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
        body: ctx.reqBody,
        query: ctx.reqQuery,
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