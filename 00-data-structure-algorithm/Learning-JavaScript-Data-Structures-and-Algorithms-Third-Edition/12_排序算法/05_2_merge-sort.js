import { Compare, defaultCompare } from '../common/util.js';
import {insertionSort} from "./04_2_insertion-sort.js";

function merge(left, right, compareFn) {
  let i = 0;
  let j = 0;
  const result = [];
  while (i < left.length && j < right.length) {
    result.push(compareFn(left[i], right[j]) === Compare.LESS_THAN ? left[i++] : right[j++]);
  }
  return result.concat(i < left.length ? left.slice(i) : right.slice(j));
}
export function mergeSort(array, compareFn = defaultCompare) {
  if (array.length > 1) { // 1
    const { length } = array;
    const middle = Math.floor(length / 2); // 2
    const left = mergeSort(array.slice(0, middle), compareFn); // 3
    const right = mergeSort(array.slice(middle, length), compareFn); // 4
    array = merge(left, right, compareFn); // 5
  }
  return array;
}

const array = [52,63,14,59,68,35,8,67,45,99];
mergeSort(array)
console.log('array',array)