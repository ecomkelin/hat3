框架核心区域
    DB 是关于数据库部分
        暂时只做了 mongodb 
            暂时用了 原生数据库连接
            mongoose 数据库框架 只写了一小部分，并且一些设计理念就借用了 mongoose
        如果想要加入其他数据库 比如 mysql 可以直接在此处添加

    env 系统环境变量 包括了
        1 系统运行时 对运行环境的判断 : 开发环境 生产环境 调试环境
        2 系统 accessToken 和 refreshToken 的密钥及过期时间
        3 nodejs 没有 ObjectId 这个变量 直接给全局加入了这个变量
        4 一些 方法 比如 isObject isObjectId isObjectIdAbs 还有 newObjectId

    server
        底层框架为 Koa
        中间件 
            1 自定义中间件 系统打印日志
                把每次前端的访问 打印出来

            2 koa-compress: 为后端服务器 静态文件开启压缩

            3 会把每次访问的 payload 加载到 ctx.payload 中

            4 Koa-body 接收 ctx.request.body
                手动优化1: 前端传递字符串 自动转为 JSON 对象格式
                手动优化2: 深入body 把里面的 ObjectId(String)转化为 真正的 ObjectId
                并 把其复制到 ctx.reqBody 

            5 koa-static 配置静态文件的位置

            6 router
                路由 做了自动加载文件生成路由 详情见 1_关于路由规则.md

            7 response