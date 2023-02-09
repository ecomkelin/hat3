/* ======================================== 常量 ======================================== */
module.exports = {
    restfulMethods: ['get', 'post', 'put', 'delete'],

    updateKeys: ["$set", "$mul", "$inc", "$remove"],
    // "$remove" 是自定义的 最终会合并到 set 中去 remove针对的是数组字段

    LIMIT: parseInt(process.env.LIMIT) || 30, // 系统中 默认调取的数据量

    CNTcodeDEF: process.env.CNTcodeDEF || "+39",

    MONTH: {
        1: "JAN", 2: "FEB", 3: "MAR", 4: "APR", 5: "MAY", 6: "JUN",
        7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC"
    }
}