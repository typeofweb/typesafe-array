import {
  makeArray,
  CustomArray,
  getElement,
  pushElement,
  popElement,
  numberToPeano,
} from "../index";


// $ExpectType CustomArray<string, Zero>
const arr1 = makeArray<string>();

// $ExpectType CustomArray<string, Succ<Zero>>
const arr2 = pushElement("aaa", arr1);

// $ExpectType CustomArray<string, Succ<Succ<Zero>>>
const arr3 = pushElement("bbb", arr2);

declare const arr10: CustomArray<string>;

// $ExpectError
const x1 = getElement(numberToPeano(12), arr1);

// $ExpectType string
getElement(numberToPeano(0), arr2);

// $ExpectError
getElement(numberToPeano(1), arr2);

// $ExpectType string
getElement(numberToPeano(1), arr3);

// $ExpectError
getElement(numberToPeano(1), arr2);


popElement(arr2);

// $ExpectError
popElement(popElement(arr2));

// $ExpectError
popElement(arr10);

// $ExpectError
getElement(numberToPeano(0), arr10);

