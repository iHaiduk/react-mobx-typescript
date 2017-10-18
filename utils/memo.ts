
export const memo = (fn: any) => {
    const cache: any = new Map();
    return (...a: any[]): typeof fn => {
        let ckey = "";
        a.map((e) => { ckey += String(e); });
        if (cache.has(ckey)) {
            return cache.get(ckey);
        } else {
            const res = fn.apply(fn, a);
            cache.set(ckey, res);
            return res;
        }
    };
};

export default memo;
