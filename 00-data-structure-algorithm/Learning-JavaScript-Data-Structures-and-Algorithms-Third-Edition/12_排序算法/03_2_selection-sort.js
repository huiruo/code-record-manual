import { Compare, defaultCompare, swap } from '../common/util.js';

export const selectionSort = (array, compareFn = defaultCompare) => {
  const { length } = array;
  let indexMin;
  for (let i = 0; i < length - 1; i++) {  // 2
    indexMin = i; // 3
    // console.log('index ' + array[i]);
    for (let j = i; j < length; j++) {  // 4
      if (compareFn(array[indexMin], array[j]) === Compare.BIGGER_THAN) {
        // console.log('new index min ' + array[j]);
        indexMin = j; // 6
      }
    }
    if (i !== indexMin) { // 7
      // console.log('swap ' + array[i] + ' with ' + array[indexMin]);
      swap(array, i, indexMin);
    }
  }
  return array;
};

console.log(selectionSort([10,8,10,2,3,5,7,8,9,1,3,4,5]))
