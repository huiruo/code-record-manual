import { Compare, defaultCompare, DOES_NOT_EXIST } from '../common/util.js';
import {quickSort} from "../12_排序算法/06_2_quicksort.js";

export function binarySearch(array, value, compareFn = defaultCompare) {

  const sortedArray = quickSort(array);
  console.log('sortedArray:',sortedArray)

  let low = 0;   // 2
  let high = sortedArray.length - 1; // 3

  while (low <= high) {   // 4

    const mid = Math.floor((low + high) / 2); // 5
    console.log('mid',mid,'low:',low,'h：',high);

    const element = sortedArray[mid]; // 6
    // console.log('mid element is ' + element);

    if (compareFn(element, value) === Compare.LESS_THAN) { // 7
      low = mid + 1;    // 8
      // console.log('low is ' + low);
    } else if (compareFn(element, value) === Compare.BIGGER_THAN) { // 9
      high = mid - 1;   // 10
      // console.log('high is ' + high);
    } else {
      // console.log('found it');
      return mid; // 11
    }
  }

  return DOES_NOT_EXIST;
}


const array = [2,3,1,5,7,9,8]
console.log('二分查找结果：',binarySearch(array,9))