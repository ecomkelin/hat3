// const fs = require('fs');
// const gm = require("gm");

// const Dir = path.resolve(process.cwd(), "test");
// let org = Dir + '/1.jpg';

// let uploadDir = Dir + '/upload/';
// /** 如果没有文件夹 则自动创建 */
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, {
//         recursive: true // 如果是深度文件夹 则循环创建
//     })
// }
// let dist = uploadDir + '1.jpg'

// gm(org)
//     .resize(240, 240)
//     .noProfile()
//     .write(dist, function (err) {
//         if (err) console.log(err)
//         if (!err) console.log('done');
//     });