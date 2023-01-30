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

            1 与前端的触点 从 next() 之前开始 next()之后 接触
                * 1 打印开始日志
                * 2 挂载 Koptions
                * 3 挂载 payload
                * 4 await next()
                * 一 返回给前端 ctx.body
                * 二 打印结束日志

            2 第三方 koa-compress: 为后端服务器 静态文件开启压缩

            3 第三方 Koa-body 可以接受 body 参数

            4 自定义中间件 ctx 参数格式化 以及 挂载一些对象
                1: 深入ctx.request.query 把里面的 ObjectId(String)转化为 真正的 ObjectId 并赋值给 ctx.reqQuery
                2: 前端传递 body 字符串的话 自动转为 JSON 对象格式
                3: 深入ctx.request.body 把里面的 ObjectId(String)转化为 真正的 ObjectId 并赋值给 ctx.reqBody
                4: 如果 reqBody 有 update 配置项 则检查是否正确 并且如果update 下面没有update关键字 则默认为 $set 关键字


            5 koa-static 配置静态文件的位置

            6 upload
                1 路由字符串中必须要包含 "updateOne" "insertOne"
                2 路由的 query参数中 必须要有 allowUpload=1 这个参数
                以上两个条件 才可以进入 文件解析 否则直接跳过 不会做文件上传
                关于文件解析 
                    1 使用filter限制了 文件类型
                    2 前台可以传递 文件夹名
                        第一层 文件夹名的规则 只要是上传的文件 都会在 upload/ 文件夹下
                        第二层 会根据payload公司生成 公司文件夹 如果没有 则自动默认为 _Firm
                        中间层 前端传递 dirs
                            dirs 参数要这么写： dirs=d1&dirs=d2 那么就会生成 d1/d2/
                        底层 query.data 默认为 false 如果为1 则加入日期 格式 yyyy_mm_dd
                        

            7 router
                路由 做了自动加载文件生成路由 详情见 1_规则.md