const gm = require("gm")
/** 生成缩略图 */
module.exports = (rel_file) => new Promise((resolve, reject) => {
    try {
        gm(DIR_PUBLIC + rel_file)
            .resize(240, 240)
            .noProfile()
            .write(DIR_PUBLIC + ABBR + rel_file, function (err) {
                if (err) return reject(err)
                return resolve();
            });
    } catch (e) {
        return reject(e)
    }
})