/*
  var obj1 = {};
  set(obj1, 'a.aa.aaa', 4}); // true
  obj1; // {a: {aa: {aaa: 4}}}
  var obj2 = {};
  set(obj2, [a, aa, aaa], 4}); // true
  obj2; // {a: {aa: {aaa: 4}}}
  var obj3 = {a: {aa: {aaa: 2}}};
  set(obj3, 'a.aa.aaa', 3); // true
  obj3; // {a: {aa: {aaa: 3}}}
  // don't clobber existing
  var obj4 = {a: {aa: {aaa: 2}}};
  set(obj4, 'a.aa', {bbb: 7}); // false
*/
function hasOwnProperty(obj: any, prop: any) {
    if (obj == null) {
        return false;
    }
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function hasShallowProperty(obj: any, prop: any) {
    return ((typeof prop === "number" && Array.isArray(obj)) || hasOwnProperty(obj, prop));
}

function getShallowProperty(obj: any, prop: any) {
    if (hasShallowProperty(obj, prop)) {
        return obj[prop];
    }
}

function getKey(key: any) {
    if (!isNaN(+key)) {
        return +key;
    }
    return key;
}

export const set = (obj: any, path: string | string[] | number | number[], value: any): any => {
    if (typeof path === "number") {
        path = [path];
    }
    if (!path || path.length === 0) {
        return obj;
    }
    if (typeof path === "string") {
        return set(obj, path.split(".").map(getKey), value);
    }
    const currentPath = path[0];
    const currentValue = getShallowProperty(obj, currentPath);
    if (path.length === 1) {
        if (currentValue === void 0) {
            obj[currentPath] = value;
        }
        return currentValue;
    }

    if (currentValue === void 0) {
        if (typeof path[1] === "number") {
            obj[currentPath] = [];
        } else {
            obj[currentPath] = {};
        }
    }

    return set(obj[currentPath], path.slice(1), value);
};

export default set;
