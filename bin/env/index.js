/**
 * 环境变量文件
 */

require('dotenv').config();    // 读取 .env 文件

/** 常用变量 path  */
path = require('path');

/** 获取所有的环境文件 */
const fs = require('fs');
const getEnvs = (dirPath) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let fns = dirName.split('.');
        if (fns.length === 3) { // 如果有两个点的文件 则加载
            if (fns[1] === "env" && fns[2] === "js") {   // 加载文件名的规则是 ***.router.js
                let file = dirPath + dirName;
                if (fs.existsSync(file)) {
                    require(file);
                }
            }
        }
    });
}


let dirPath = path.join(process.cwd(), "bin/env/");
getEnvs(dirPath);

