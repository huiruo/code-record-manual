setTimeout(() => {
  console.log("4");
  setTimeout(() => {
    console.log("8");
  }, 0);
  new Promise((r) => {
    console.log("5");//构造函数是同步的
    r();
  }).then(() => {
    console.log("7");//then()是异步的，这里已经入队
  });
  console.log("6");
}, 0);

new Promise((r) => {
  console.log("1");//构造函数是同步的
  r();
}).then(() => {
  console.log("3");//then()是异步的，这里已经入队
});
console.log("2");