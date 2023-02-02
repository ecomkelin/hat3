const fs = require("fs");

/** 删除图片 */
module.exports = handleFiles => {
    if (handleFiles instanceof Array) {
        for (let i = 0; i < handleFiles.length; i++) {
            let delFile = handleFiles[i];
            fs.unlink(DIR_PUBLIC + delFile, (err) => {
                if (err) {
                    console.error("删除图片失败", err);
                } else {
                    console.info("已删除图片: ", DIR_PUBLIC + delFile);
                }
            });
            /** 同时将其缩略图删除 */
            fs.unlink(DIR_PUBLIC + ABBR + delFile, (err) => {
                if (err) {
                    console.error("删除图片失败", err);
                } else {
                    console.info("已删除图片: ", DIR_PUBLIC + ABBR + delFile);
                }
            });
        }
    }
}