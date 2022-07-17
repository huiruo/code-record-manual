import { Compare, defaultCompare, swap } from '../common/util.js';

function partition(array, left, right, compareFn) {
  const pivot = array[Math.floor((right + left) / 2)]; // 8
  let i = left; // 9
  let j = right; // 10

  while (i <= j) { // 11
    while (compareFn(array[i], pivot) === Compare.LESS_THAN) { // 12
      i++;
    }
    while (compareFn(array[j], pivot) === Compare.BIGGER_THAN) { // 13
      j--;
    }
    if (i <= j) { // 14
      swap(array, i, j); // 15
      i++;
      j--;
    }
  }
  return i; // 16
}

function quick(array, left, right, compareFn) {
  let index;  // 1
  if (array.length > 1) { // 2
    index = partition(array, left, right, compareFn); // 3
    if (left < index - 1) {   // 4
      quick(array, left, index - 1, compareFn); // 5
    }
    if (index < right) {  // 6
      quick(array, index, right, compareFn); // 7
    }
  }
  return array;
}

export function quickSort(array, compareFn = defaultCompare) {
  return quick(array, 0, array.length - 1, compareFn);
}

const array = [52,63,14,59,68,35,8,67,45,99];
// quickSort(array)
// console.log('array',array)
