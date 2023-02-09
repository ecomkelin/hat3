const fs = require('fs');
const readFile = require("./readFile");

let addRoute = null;
/** 自动加载路由
 * @param {Path} dirPath 当前绝对路径
 * @param {Array} paths 经过的所有 路径的 文件夹名称
 * @param {Number} n 路径的层级
 */
const recuReadFiles = (dirPath, paths, n) => {
    fs.readdirSync(dirPath).forEach(readName => {
       let fns = readName.split('.'); // 模糊判断是否 文件夹 或文件
       let dirLen = fns.length;
 
       if (dirLen === 1) {           // 如果是文件夹 则进一步读取内容
          paths[n + 1] = readName;    // 第number层
          let dns = readName.split('_')
          if (dns.length === 1) {  //   如果文件夹用 下划线拆分 则不读取里面的内容
             recuReadFiles(path.join(dirPath + readName + '/'), paths, n + 1);
          }
       } else if (dirLen === 3 && fns[dirLen - 1] === "js") {   // 如果是js文件
          let fileType = fns[1];         // 路由的获取地址方式 get post put delete
          let file = dirPath + readName;
          if (fs.existsSync(file)) {    // 每个文件为一个api
             let reqFile = require(file);  // require 文件
 
             let fileName = readName.split('.')[0];
             readFile(fileType, reqFile, fileName, paths, n, addRoute);
          }
       }
    });
 }

 const pathAbsolute = path.join(process.cwd(), "src/")
 module.exports = (_addRoute) => {
    addRoute = _addRoute;
    recuReadFiles(pathAbsolute, ['src'], 0);

 }