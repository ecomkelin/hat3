const gm = require("gm")
const dirTest = path.resolve(process.cwd(), "test/");
const dir = dirTest + '/upload/';
/** 生成缩略图 */
module.exports = (options = {}) => {
    try {
        const { logo, resize } = options;

        /** 缩略图的位置 */
        const picName = '1.png';

        const urlOrg = dir + picName;
        const urlDest = dir + "ar_" + picName;

        if (resize) {
            gm(urlOrg)
                .resize(1000, 1000)
                .noProfile()
                .write(urlDest, function (err) {
                    if (err) console.log(" err: ", err);
                });
        } else if (logo) {
            const urlLogo = dir+"logo.png";
            const drawStr = `image Over 0,0 50,50 "${urlLogo}"`
            // 加载原始图片
            gm(urlOrg)
                // 设置水印位置和大小
                .draw([drawStr])
                // .draw(['image Over 0,0 0,0 "/path/to/logo.png"'])
                // 输出加水印后的图片
                .write(urlDest, function (err) {
                    if (err) console.log("logo err: ", err);
                });
        }
    } catch (e) {
        console.error("gm thumbnail: ", e);
    }
}