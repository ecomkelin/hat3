module.exports = (CLoptions, CLdoc) => {
    for(let key in CLdoc) {
        let CLfield = CLdoc[key];
        if(CLfield.ENcryption) {
            if(!CLoptions.needEncryption) CLoptions.needEncryption = {method: "md5", fields: []};
            CLoptions.needEncryption.fields.push(key)
        }

        let isArray= 'string';
        if(CLfield instanceof Array) {
            CLfield = CLfield[0];
            isArray = 'array';
        }
        if(CLfield.ALLOW_upload) {
            if(!CLoptions.optFiles) CLoptions.optFiles = {};
            CLoptions.optFiles[key] = isArray
        }
    }
}