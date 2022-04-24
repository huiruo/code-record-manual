let array1 = [1, 3];
let array2 = [
  { id: 1, label: "tes1" },
  { id: 2, label: "tes2" },
  { id: 3, label: "tes3" },
  { id: 4, label: "tes3" },
];
let targetArr = array2.filter((ele) => {
  return (
    -1 !==
    array1.findIndex((item) => {
      console.log("item:", item);
      return item === ele.id;
    })
  );
});
console.log("test", targetArr);
