const __type = Symbol("CustomArray");
// type __Type = typeof __type;

type Sizes = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CustomArray<T = unknown, Size extends Sizes = Sizes> = {
  [__type]: { t?: T; s: Size; elements: ReadonlyArray<T> };
};

type AdditionTable = {
  0: 1;
  1: 2;
  2: 3;
  3: 4;
  4: 5;
  5: 6;
  6: never;
};

type SubtractionTable = {
  0: never;
  1: 0;
  2: 1;
  3: 2;
  4: 3;
  5: 4;
  6: 5;
};

type ComparisonTable = {
  0: {};
  1: {
    0: true;
  };
  2: {
    0: true;
    1: true;
  };
  3: {
    0: true;
    1: true;
    2: true;
  };
  4: {
    0: true;
    1: true;
    2: true;
    3: true;
  };
  5: {
    0: true;
    1: true;
    2: true;
    3: true;
    4: true;
  };
  6: {
    0: true;
    1: true;
    2: true;
    3: true;
    4: true;
    5: true;
  };
};

type IncrementSize<Size extends Sizes> = AdditionTable[Size];
type DecrementSize<Size extends Sizes> = SubtractionTable[Size];

type SizeIsLargerThanN<
  Size extends Sizes,
  N extends Sizes
> = N extends keyof ComparisonTable[Size] ? true : false;

type GetElementReturn<
  Arr extends CustomArray,
  N extends Sizes
> = Arr extends CustomArray<infer T, infer Size>
  ? SizeIsLargerThanN<Size, N> extends true
    ? T
    : undefined
  : never;

type PopElementReturn<Arr extends CustomArray> = Arr extends CustomArray<
  infer T,
  infer Size
>
  ? SizeIsLargerThanN<Size, 0> extends true
    ? CustomArray<T, DecrementSize<Size>>
    : never
  : never;

export function makeArray<T>(): CustomArray<T, 0> {
  return {
    [__type]: { s: 0, elements: [] },
  };
}

export function pushElement<T, Size extends Sizes>(
  element: T,
  arr: CustomArray<T, Size>
): CustomArray<T, IncrementSize<Size>> {
  const { elements, s } = arr[__type];
  return {
    [__type]: {
      s: (s + 1) as IncrementSize<Size>,
      elements: [...elements, element],
    },
  };
}

export function popElement<T, Size extends Sizes>(
  arr: Size extends 0 ? never : CustomArray<T, Size>
): PopElementReturn<typeof arr> {
  const { elements, s } = arr[__type];
  // @ts-expect-error
  if (s === 0) {
    return undefined as never;
  }

  return {
    [__type]: {
      s: (s + 1) as DecrementSize<Size>,
      elements: elements.slice(0, -1),
    },
  } as PopElementReturn<typeof arr>;
}

export function getElement<T, N extends Sizes, Size extends Sizes>(
  n: N,
  arr: SizeIsLargerThanN<Size, N> extends true ? CustomArray<T, Size> : never
): GetElementReturn<typeof arr, N> {
  return arr[__type].elements[n] as GetElementReturn<typeof arr, N>;
}
