/*
* for
* */
const arr = ["1", "5", "10", "25", "40", "1000"];

for (let i = 0; i < arr.length; i++) {
    console.log('for:', i, 'val:', arr[i]);
}

/*
* forEach
* */
arr.forEach((value, index, array) => {
    console.log(`value:${value}    index:${index}     array:${array}`)
})
