/* ======================================== 常量 ======================================== */
module.exports = {
    LIMIT : parseInt(process.env.LIMIT) || 30, // 系统中 默认调取的数据量
    
    CNTcodeDEF : process.env.CNTcodeDEF || "+39",

    MONTH : {
        1: "JAN", 2: "FEB", 3: "MAR", 4: "APR", 5: "MAY", 6: "JUN",
        7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC"
    }
}