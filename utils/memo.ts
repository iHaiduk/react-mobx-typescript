
export const memo = (fn) => {
    let cache = {};
    return function(...a: any[]): typeof fn {
        let k = "";
        a.map((e) => { k += String(e) });
        return typeof cache[k] !== 'undefined' ? cache[k] : (cache[k] = fn.apply(fn, a));
    };
};

export default memo;