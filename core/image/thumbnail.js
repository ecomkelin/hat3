const fs = require("fs")
const gm = require("gm")
/** 生成缩略图 */
module.exports = (rel_file, rel_path) => new Promise((resolve, reject) => {
    try {
        /** 缩略图的位置 */
        const abbrDir = DIR_PUBLIC + ABBR + rel_path;
        /** 如果没有文件夹 则自动创建 */
        if (!fs.existsSync(abbrDir)) {
            fs.mkdirSync(abbrDir, {
                recursive: true // 如果是深度文件夹 则循环创建
            })
        }

        gm(DIR_PUBLIC + rel_file)
            .resize(240, 240)
            .noProfile()
            .write(DIR_PUBLIC + ABBR + rel_file, function (err) {
                if (err) return reject(err)
                return resolve();
            });
    } catch (e) {
        console.error("gm thumbnail: ", e);
        return reject(e)
    }
})