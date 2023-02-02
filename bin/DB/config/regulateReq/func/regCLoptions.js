module.exports = (Koptions, CLoptions) => {
    const {flagArrs, flagStrs} = Koptions;
    /** 3 查看上传的这些文件 在模型中是否允许被上传 */
    if(flagStrs instanceof Array && flagStrs.length > 0) {
        if(!isObject(CLoptions.optFiles)) return '此集合 不允许上传文件';
        for(let i in flagStrs) {
            if(!CLoptions.optFiles[flagStrs[i]]) return "此字段 不允许上传文件"
        }
    }

    if(flagArrs instanceof Array && flagArrs.length > 0) {
        if(!isObject(CLoptions.optFiles)) return '此集合 不允许上传文件';
        for(let i in flagArrs) {
            if(!CLoptions.optFiles[flagArrs[i]]) return "此数组字段 不允许上传文件"
        }
    }
}