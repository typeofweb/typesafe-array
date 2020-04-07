import {
  makeArray,
  CustomArray,
  getElement,
  pushElement,
  popElement,
} from "../index";


// $ExpectType CustomArray<string, 0>
const arr1 = makeArray<string>();

// $ExpectType CustomArray<string, 1>
const arr2 = pushElement("aaa", arr1);

// $ExpectType CustomArray<string, 2>
const arr3 = pushElement("bbb", arr2);

declare const arr10: CustomArray<string>;

// $ExpectError
const x1 = getElement(12, arr1);

// $ExpectType string
getElement(0, arr2);

// $ExpectError
getElement(1, arr2);

// $ExpectType string
getElement(1, arr3);

// $ExpectError
getElement(1, arr2);


popElement(arr2);

// $ExpectError
popElement(popElement(arr2));

// $ExpectError
popElement(arr10);

// $ExpectError
getElement(0, arr10);
