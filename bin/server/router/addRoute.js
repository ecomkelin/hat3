const { restfulMethods } = require(path.resolve(process.cwd(), 'core/constant'));

/** 自动新增一个路由
 * @param {*} restfulMethod 路由的类型
 * @param {*} routePath    路由的路径
 * @param {*} reqFunc   路由的执行函数
 * @returns 并把此路由收集到 routeObjs中 交由最后一个路由统一暴露
 */
module.exports = (router, routeObjs) =>
    (restfulMethod, routePath, reqFunc) => {
        if (!restfulMethods.includes(restfulMethod)) {
            console.error(`注意：${routePath} 此路径的 方法不对 没有加载到系统`)
            return;
        };
        let routeObj = restfulMethod + " - " + routePath.toLowerCase();
        if (routeObjs.includes(routeObj)) {
            console.error("注意: 有相同路径的路由", routeObj);
            return;
        }
        routeObjs.push(routeObj);

        router[restfulMethod](routePath, reqFunc);
    }