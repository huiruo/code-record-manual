console.log('打印' + 1);

setTimeout(function () {
  console.log('打印setTimeout' + 2);
})

new Promise(function (resolve, reject) {
  console.log('打印' + 3);
  resolve()
}).then(function () {
  console.log('打印then(' + 4)
});;

console.log('打印' + 10);

let promiseA = new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log('打印setTimeout' + 5);
  });
  resolve()
})

promiseA.then(() => {
  console.log('打印then(' + 6)
});

setTimeout(function () {
  new Promise(function (resolve, reject) {
    console.log('打印setTimeout' + 7);
  });
})
/*
打印1
打印3
打印10
打印then(4
打印then(6
打印setTimeout2
打印setTimeout5
打印setTimeout7
*/