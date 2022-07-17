import { Compare, defaultCompare } from '../common/util.js';

export const insertionSort = (array, compareFn = defaultCompare) => {
  const { length } = array;
  let temp;
  for (let i = 1; i < length; i++) { // 2
    let j = i;  // 3
    temp = array[i];  // 4
    // console.log('to be inserted ' + temp);
    while (j > 0 && compareFn(array[j - 1], temp) === Compare.BIGGER_THAN) {  // 5
      // console.log('shift ' + array[j - 1]);
      array[j] = array[j - 1];    // 6
      j--;
    }
    // console.log('insert ' + temp);
    array[j] = temp;  // 7
  }
  return array;
};

const array = [52,63,14,59,68,35,8,67,45,99];
insertionSort(array)
console.log('array',array)

