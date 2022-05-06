const a = {};
const b = Symbol("123");
const c = Symbol("123");

a[b] = "b";
a[c] = "c";

console.log("test:", a[b]); // b

console.log("分割线--------->");
const a1 = {};
const b1 = { key: "123" };
const c1 = { key: "456" };

a1[b1] = "b";
a1[c1] = "c";
console.log("test2:", a1[b1]); // c
