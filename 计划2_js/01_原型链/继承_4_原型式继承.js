// 函数内部，先创建了一个临时性构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};
let anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

let yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

console.log(person.friends);   //"Shelby,Court,Van,Rob,Barbie"