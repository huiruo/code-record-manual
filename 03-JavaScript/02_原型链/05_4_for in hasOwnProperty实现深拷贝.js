

function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    // for in 会走原型链
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]);   // 递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}
