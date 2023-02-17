module.exports = (router, routeObjs) => {
    router.get('/', ctx => {
        let { filter } = ctx.query;
        filter = filter ? filter.toLowerCase() : "";
        const routes = routeObjs.filter(item => item.toLowerCase().indexOf(filter) !== -1);
        return ctx.success = {
            desc: "显示了所有路由的列表",
            filter: "可以用query筛选查看。形式为 ?filter='xxx'",
            couter: routes.length + ' / ' + routeObjs.length,
            routes
        }
    });    // /routers 路由 查看所有路由
}