/**
* 简单数组的 倒序
* @param {String} field 根据哪个属性排序
* @param { -1 } sort 如果不是-1 那么就为升序 否则为降序
* EX: arr.sort(SortReverse);
*/
exports.SortReverse = (m, n) => m >= n ? -1 : 1;


/**
 * 对象数组排序 sort()中的参数
 * @param {String} field 根据哪个属性排序
 * @param {Number: [1 / -1]} sort 如果不是-1 那么就为升序 否则为降序
 * EX: arr.sort(SortParam("field"[, -1]))
 */
exports.SortParam = (field, sort = 1) => { //这是比较函数
	if (sort !== -1) sort = 1;
	return (m, n) => {
		var a = m[field];
		var b = n[field];
		return a >= b ? 1 * sort : -1 * sort;
	}
}




/**
 * 对象数组排序
 * @param {Array} array: 要排序的数组
 * @param {String} field: 根据 数组对象中的 指定属性 排序
 * @param {Object} options: {sort, is_strict}
 * 		@param {Number} sort: 枚举类型 [1, -1] 默认为1 升序 -1 为降序
 * 		@param {Boolean} is_strict: 如果严格排序的话 就把每个对象中的属性也排序整齐
 * returns [-2, array] -2 参数错误 array排好序的数组
 * 注意 实参array 不会根据形参变化 最终结果 返回被赋值的 array 才会变化
 */
exports.sortArrayObj = (array, field, options = {}) => {
	if (!(array instanceof Array)) return -2;

	/** field 检测 */
	if (!field) return -2;
	field = String(field);  // 强行转为 String类型

	let { sort = 1, is_strict = true } = options;
	if (sort !== -1) sort = 1; // sort 赋值
	if (is_strict !== true) is_strict = false; // is_strict 赋值

	array.sort(SortParam(field, sort)); // 排序

	// 如果为严格模式
	if (is_strict) array = JSON.parse(JSON.stringify(array, Object.keys(array[0]).sort()));

	return array;
}
// let objs = [{_id: 2, code: "002"}, {code: "003", _id: 3}, {_id: 1, code: "001"}];
// let objj = sortArrayObj(objs, "_id", {sort: 1, is_strict: true});





/**
 * 两个数组是否 相同 [如果只是排序不同 或其中对象属性的排序不同 则视为相同]
 * @param {Array} arr1 参与比较的第一个数组
 * @param {Array} arr2 参与比较的第二个数组
 * @param {Object} options: {field}
 * 		@param {String} field 可选 对象数组中的属性 最好是唯一属性 以便排序不出错
 * 						如果其中有 field 则说明是 对象数组 否则按照简单数组处理
 * returns [-2, false, true] -2 为参数错误 false 为不同 true为相同
 */
 exports.isArraySame = (arr1, arr2, options = {}) => {
	if (!(arr1 instanceof Array)) return -2;
	if (!(arr2 instanceof Array)) return -2;
	arr1 = [...arr1];
	arr2 = [...arr2];

	if (arr1.length !== arr2.length) return false;   // 如果长度不同 肯定不相同

	let { field } = options;
	/** field 检测 */
	if (field) {
		/** 判定为对象数组 */
		field = String(field);  // 强行转为 String类型

		arr1 = sortArrayObj(arr1, field);
		arr2 = sortArrayObj(arr2, field);
	} else {
		arr1.sort();
		for (let i in arr1) if (!isNaN(arr1[i])) arr1[i] = String(arr1[i]);
		arr2.sort();
		for (let i in arr2) if (!isNaN(arr2[i])) arr2[i] = String(arr2[i]);
	}

	return JSON.stringify(arr1) === JSON.stringify(arr2);
}
/*
// let arr1 = [
// 	{_id: 1, code: 123},
// 	{_id: 2, code: "123"},
// 	{_id: 3, code: 456},
// 	{_id: 4, code: "456"},
// 	{_id: 5, code: 123},
// 	{_id: 6, code: "123"}
// ];
// let arr2 = [
// 	{_id: 2, code: "123"},
// 	{_id: 1, code: 123},
// 	{_id: 3, code: 456},
// 	{_id: 4, code: "456"},
// 	{_id: 5, code: 123},
// 	{code: "123", _id: 6}
// ];
// let field = "_id";
// let options = {field}

let arr1 = [123, "123", 456, "456", 123, "123"];
let arr2 = [123, "123", 123, "456", 456, "123"];
let options = {};

let result = isArraySame(arr1, arr2, options);

*/








/**
 * 获取 要被删除的 数组下标们 ids 
 * 服务于 ArrayDelChild 方法
 * @param {Array} array 被操作的数组
 * @param {TypeBasic} value 要被删除的值
 * @param {Object} options : {is_repeat=true, is_strict=false, field}
 * 		@param {Boolean} is_repeat : 是否重复删除
 * 		@param {Boolean} is_strict : 是否为严格模式
 * 		@param {String} field : 对象数组的属性 分别对比此数组的每个对象的此属性的值
 * returns [Array] ids 要被删除的 数组下标们
 */
const obtIds = (array, value, options = {}) => {
	let ids = [];

	let { is_repeat = true, is_strict = false, field } = options;
	if (is_repeat !== false) is_repeat = true;
	if (is_strict !== true) is_strict = false;
	if (field) field = String(field);  // 强行转为 String类型

	let i = 0;
	for (; i < array.length; i++) {
		let val = field ? array[i][field] : array[i];
		if ((is_strict && val === value) || (!is_strict && String(val) == String(value))) {
			if (is_repeat) { // 重复删除
				if (!ids.includes(i)) ids.unshift(i); // 如果i还不存在 ids中, 因为如果ids中有两个相同的数 则错误
			} else {
				break;
			}
		}
	}
	if (i !== array.length && !ids.includes(i)) ids.unshift(i);  // 不重复删除 每次删除一个

	return ids;
}
/**
 * 删除 数组 中的一个元素 或数组
 * @param {Array} array 要操作的数组
 * @param {TypeBasic / Array} values 要被删除的元素 或者 子数组
 * @param {Boolean} is_repeat 是否重复的全部删除
 * returns [-2, array] -2为参数错误 array 为新的 被去掉子元素的 新数组
 * EX: ["aa", "bb", "aa"] 删除 "aa" 后 为 ["bb", "aa"], 如果是重复删除 则结果为 ["bb"];
 */
 exports.ArrayDelChild = (array, values, options) => {
	if (!(array instanceof Array)) return -2;

	if (!values) return -2;
	let isArray = (values instanceof Array) ? true : false;    // values 是否为数组

	let ids;
	if (isArray) {   // 如果 elems是数组
		for (let k in values) {
			value = values[k];// 为每一个要删除的元素遍历

			ids = obtIds(array, value, options);
		}
	} else {    // 如果elems 只是一个基本元素
		let value = values;
		ids = obtIds(array, value, options);
	}

	// 开始删除元素
	for (let i in ids) array.splice(ids[i], 1);

	return array;
}

/*
let arrs = [
 {_id: 1, code: 123},
 {_id: 2, code: "123"},
 {_id: 3, code: 456},
 {_id: 4, code: "456"},
 {_id: 5, code: 123},
 {_id: 6, code: "123"}
];
let field = "code";
let val = "123";

// let field;
// let arrs = [123, "123", 456, "456", 123, "123"];
// let val = 123;

let is_repeat = false;
let is_strict = true;
let options = {is_repeat, is_strict, field};

let arrs1 = ArrayDelChild(arrs, val, options);
*/