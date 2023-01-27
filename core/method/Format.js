/**
 * 格式化电话号码前缀 为+XX
 * @param {String} CNTcode 
 * @returns [String]
 */
const {CNTcodeDEF} = require(path.resolve(process.cwd(), 'core/constant'));

exports.format_CNTcode = (CNTcode) => {
	if(!CNTcode) return CNTcodeDEF;

    CNTcode = String(CNTcode);
    CNTcode = CNTcode.replace(/^\s*/g,"");

	if(CNTcode[0] === "+") { 
		if(!isNaN(CNTcode.substring(1))) return CNTcode;
	} else {
		if(!isNaN(CNTcode)) return "+"+CNTcode;
	}
	
	return CNTcodeDEF;
}