const fs = require("fs");
const moment = require('moment');

const { tokenParse, acTokenPayload } = require(path.join(process.cwd(), "core/crypto/jwt"));

module.exports = async (ctx, next) => {
    let start = Date.now();
    try {

        /** 程序开始 第一次进入中间件 
         * 本次执行程序的开始时间 并记录开始的时间
        */
        console.info(moment(start).format("YYYY-MM-DD HH:mm:ss "), `[ ${ctx.method} ] ${ctx.url}`);
    
        /** 挂载 Koptions */
        ctx.Koptions = {};
        /** 把将要被删除文件的路径 挂载到 Koptions 上去 */
        ctx.Koptions.handleFiles = [];
        ctx.Koptions.will_handleFiles = [];
        
        // console.log( " @@ contactFront ", ctx.headers);
        /** 把payload挂载到 Koptions上去 */
        let payload;
        /** 包含有 login 的url 不用检查 token 因为肯定没有带 */
        if (ctx.url.includes("/login")) payload = {};
        else payload = await acTokenPayload(ctx.request.headers['authorization']);
        ctx.Koptions.payload = payload;

        /** 最后 打印日志 生成时间 */
        let person = 'authorization: ';
        if (payload) {
            let { code, name, role } = payload;
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
        request = (ctx.reqQuery && ctx.reqQuery.request == 1) ? getRequest(ctx) : undefined;                  // 开发环境 返回前端 请求数据

        if (ctx.fail) failHandle(ctx);                                // 收到错误信息
        else if (ctx.success) successHandle(ctx);                     // 成功从后端获得数据
        else if (!ctx.body) {
            ctx.status = 405;
            ctx.body = {
                status: 405,
                steps: [`首先检查: 是否有此 [ ${ctx.url} ] 路由`, "如果路由没有问题 那么 此路由没有写body 请联系管理员"]
            }
        }


    } catch (e) {
        ctx.fail = e;
        failHandle(ctx);
    } finally {
        let end = Date.now();
        let ms = end - start;
        console.info(ctx.status, `用时: ${ms}ms \n`);
    }
}


/** 返回给前端 */
let request;
const failHandle = ctx => {
    let fail = ctx.fail;
    console.error("contactFront: ", fail)
    /** 服务器错误 */
    if (fail.stack) {
        ctx.status = 500;
        ctx.body = { status: 500, server_error: fail.stack, request }
    }

    else if (fail.status === 401) {
        // ctx.status = 401;
        ctx.status = 200; // 为了前端验证方便
        ctx.body = { ...fail, request };
    }
    /** 前端的参数错误 */
    else if (isObject(fail)) {     // 错误信息给的是对象
        let status = 400;
        if (fail.status) {     // 自定义错误状态
            status = fail.status;
            delete fail.status;
        }

        // ctx.status = status;
        ctx.body = { status, fail, request };
    } else {        // 错误信息给的是字符串
        ctx.status = 400;
        ctx.body = { status: 400, fail, request };
    }
}

const successHandle = (ctx) => {
    const success = ctx.success;
    const trustToken = ctx.headers['trust-token']
    ctx.status = 200;
    ctx.response.set('Trust-Token', trustToken);
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
        payload: ctx.Koptions.payload,
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