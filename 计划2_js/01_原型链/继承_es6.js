
/*
* ES6 的继承机制完全不同，实质上是先创建父类的实例对象 this（所以必须先调用父类的 super()方法），然后再用子类的构造函数修改 this。
* */
class Person{
    constructor(name,age){  //一,类的构造方法
        this.name=name;
        this.age=age;
    }
    //类的一般方法
    showName(){
        console.log(this.name)
    }
}

//通过extends来实现类的继承
class StarPerson extends Person{
    constructor(name,age,salary){
        super(name,age)  //重点必须的：通过super调用父类的构造方法：调用父类的constructor()
        this.salary=salary;
    }
    showName(){  //父类方法重写
        console.log(this.name,this.age,this.salary)
    }
}
let p1=new StarPerson('name3',25,200)  //重点：对应的
console.log(p1)  //StarPerson name: "name3", age: 25, salary: 200}
p1.showName()	 //name3 25 200