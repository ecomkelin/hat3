/* 此实验 证明 异步函数 处理相同的数据 会比正常函数 多处50ms 处理异步的问题
const num = 100000000;
const f1 = () => new Promise((resolve, reject) => {
    try {
        let n = 1;
        for(let i=0; i<num; i++) {
            n += i;
        }
        return resolve(n)

    } catch (e) {
        return reject(e)
    }
})
const f2 = () => {
    try {
        let n = 1;
        for(let i=0; i<num; i++) {
            n += i;
        }
        return n;
    } catch (e) {
        return e
    }
}

const fn = async () => {
    try {
        // const a = await f1();
        let t1 = Date.now();
        const n1 = await f1();
        console.log("Time1: ", Date.now() - t1, n1);

        let t2 = Date.now();
        const n2 =  f2();
        console.log("Time2: ", Date.now() - t2, n2)
    } catch (e) {
        console.log(3, e)
    }
}
fn()

*/