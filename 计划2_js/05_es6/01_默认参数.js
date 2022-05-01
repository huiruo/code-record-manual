
const params = [1,6,3]

function sum(x = 1, y = 2, z = 3) {
    return x + y + z;
}

console.log(sum(...params)); // ES2015