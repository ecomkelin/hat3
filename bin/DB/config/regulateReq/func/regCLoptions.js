module.exports = (Koptions, CLoptions) => {
    const {flagArr, reFields} = Koptions;
    /** 3 查看上传的这些文件 在模型中是否允许被上传 */
    if(reFields instanceof Array && reFields.length > 0) {
        if(!isObject(CLoptions.optFiles)) return '此集合 不允许上传文件';
        for(let i in reFields) {
            if(!CLoptions.optFiles[reFields[i]]) return "此字段 不允许上传文件"
        }
    }

    if(flagArr instanceof Array && flagArr.length > 0) {
        if(!isObject(CLoptions.optFiles)) return '此集合 不允许上传文件';
        for(let i in flagArr) {
            if(!CLoptions.optFiles[flagArr[i]]) return "此数组字段 不允许上传文件"
        }
    }
}