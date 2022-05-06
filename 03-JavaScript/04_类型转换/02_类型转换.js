

console.log(`[] !== []`,[] !== [])  // true
console.log(`NaN != NaN`,NaN != NaN) // true
console.log(`null == undefined`,null == undefined) // true
console.log(`1 == true`,1 == true) // true
console.log(`null > 0`,null > 0) // false
console.log(`true + 1`,true + 1) // 2
console.log(`undefined + 1`,undefined + 1) // NaN
console.log(`{} + 1`,{} + 1) // [object Object]1
console.log(`[] + {}`,[] + {}) // [object Object]

console.log('分割线===》')
console.log(`'' == '0'`,'' == '0')           // false
console.log(`0 == ''`,0 == '')             // true
console.log(`0 == '0'`,0 == '0')            // true
console.log(`false == 'false'`,false == 'false')    // false
console.log(`false == '0'`,false == '0')        // true
console.log(`false == undefined`,false == undefined)  // false
console.log(`false == undefined`,false == null)       // false
console.log(`null == undefined`,null == undefined)   // true
/*
number和boolean用==比较时会把boolean转换为number再比较值,true转换为number是1
*/
console.log('分割线===》')
console.log(`!2`,!2)  //false
console.log(`!!2==true`,!!2==true)  // true
console.log(`[]==true`,[]==true)   //false，因为：//Boolean([].toString());为false ,[].toString()为空。
console.log(`{}==true`,{}==true)  //false