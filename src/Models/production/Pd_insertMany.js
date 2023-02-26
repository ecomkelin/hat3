const fs = require('fs');
const pathPublic = path.join(process.cwd(), "public/")
const manuale = 'manuale/'

let imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const thumbnail = require(path.resolve(process.cwd(), 'core/image/thumbnail'));

module.exports = (code, manuName = 'omilan') => {
    try {

        const manuPathAbs = pathPublic + manuale + manuName + '/';
        const manuPathRel = '/' + manuale + manuName + '/';

        const imgs = [];
        fs.readdirSync(manuPathAbs).forEach(dirName => {
            if (parseInt(dirName) === parseInt(code)) {
                const dirPathAbs = manuPathAbs + dirName + '/';
                const dirPathRel = manuPathRel + dirName + '/';
                fs.readdirSync(dirPathAbs).forEach(async fileName => {
                    let fileNs = fileName.split('.');
                    let fileType = fileNs[fileNs.length - 1].toLowerCase();         // 文件的类型
                    if (!imageTypes.includes(fileType)) return;
                    let filePathAbs = dirPathAbs + fileName;
                    let filePathRel = dirPathRel + fileName;
                    try {
                        thumbnail(filePathRel, dirPathRel);
                    } catch (err) {
                        console.log(" ##### ", err)
                    }
                    if (fs.existsSync(filePathAbs)) {
                        imgs.push(filePathRel);
                    }
                })
                return;
            }
        });
        return imgs;
    } catch (e) {
        throw (e);
    }
}