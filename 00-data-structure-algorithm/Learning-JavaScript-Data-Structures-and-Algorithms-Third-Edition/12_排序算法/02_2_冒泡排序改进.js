import { Compare, defaultCompare, swap } from '../common/util.js';

export function modifiedBubbleSort(array, compareFn = defaultCompare) {
    const { length } = array;
    var cost = 0;
    for (let i = 0; i < length; i++) {
        // console.log('--- ');
        for (let j = 0; j < length - 1 - i; j++) { // 1
            cost++;
            // console.log('compare ' + array[j] + ' with ' + array[j + 1]);
            if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
                // console.log('swap ' + array[j] + ' with ' + array[j + 1]);
                swap(array, j, j + 1);
            }
        }
    }

    console.log('cost for bubbleSort with input size ' + length + ' is ' + cost);
    console.log('array:',array);
    /*
    cost for bubbleSort with input size 13 is 78
    array: [
       1, 2, 3, 3, 4,  5,
       5, 7, 8, 8, 9, 10,
      10
    ]
    * */
    return array;
}

modifiedBubbleSort([10,8,10,2,3,5,7,8,9,1,3,4,5])
