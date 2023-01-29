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
            0 统一输出 next() 之上没有任何信息
                之下 统一输出 ctx.body

            1 自定义中间件 系统打印日志
                把每次前端的访问 打印出来

            2 第三方 koa-compress: 为后端服务器 静态文件开启压缩

            3 第三方 Koa-body 可以接受 body 参数

            4 自定义中间件 ctx 参数格式化 以及 挂载一些对象
                手动优化1: 前端传递 body 字符串的话 自动转为 JSON 对象格式
                手动优化2: 深入ctx.request.body 把里面的 ObjectId(String)转化为 真正的 ObjectId 并赋值给 ctx.reqBody
                手动优化3: 深入ctx.request.query 把里面的 ObjectId(String)转化为 真正的 ObjectId 并赋值给 ctx.reqQuery
                4 挂载 Koptions 对象到 ctx 即 ctx.Koptions = {} 用来处理后端产生的数据
                5 把 token 生成 payload 并赋给 ctx.Koptions

            5 koa-static 配置静态文件的位置

            6 router
                路由 做了自动加载文件生成路由 详情见 1_关于路由规则.md