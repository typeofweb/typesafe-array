const __type = Symbol("CustomArray");
// type __Type = typeof __type;

type Sizes = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CustomArray<
  T = unknown,
  Size extends Sizes = Sizes
> = {
  [__type]: { t?: T; s: Size; elements: Array<T> };
};

type IncrementSize<
  Size extends Sizes
> = Size extends 0
  ? 1
  : Size extends 1
  ? 2
  : Size extends 2
  ? 3
  : Size extends 3
  ? 4
  : Size extends 4
  ? 5
  : Size extends 5
  ? 6
  : never;
type DecrementSize<
  Size extends Sizes
> = Size extends 0
  ? never
  : Size extends 1
  ? 0
  : Size extends 2
  ? 1
  : Size extends 3
  ? 2
  : Size extends 4
  ? 3
  : Size extends 5
  ? 4
  : Size extends 6
  ? 5
  : never;

type SizeHasN<
  Size extends Sizes,
  N extends Sizes
> = Size extends 0
  ? false
  : Size extends 1
  ? N extends 0
    ? true
    : false
  : Size extends 2
  ? N extends 1
    ? true
    : {
        0: SizeHasN<DecrementSize<Size>, N>;
      }[N extends any ? 0 : never]
  : Size extends 3
  ? N extends 2
    ? true
    : {
        0: SizeHasN<DecrementSize<Size>, N>;
      }[N extends any ? 0 : never]
  : Size extends 4
  ? N extends 3
    ? true
    : {
        0: SizeHasN<DecrementSize<Size>, N>;
      }[N extends any ? 0 : never]
  : Size extends 5
  ? N extends 4
    ? true
    : {
        0: SizeHasN<DecrementSize<Size>, N>;
      }[N extends any ? 0 : never]
  : Size extends 6
  ? N extends 5
    ? true
    : {
        0: SizeHasN<DecrementSize<Size>, N>;
      }[N extends any ? 0 : never]
  : never;

type GetElementReturn<
  Arr extends CustomArray,
  N extends Sizes
> = Arr extends CustomArray<infer T, infer Size>
  ? SizeHasN<Size, N> extends true
    ? T
    : undefined
  : never;

type PopElementReturn<
  Arr extends CustomArray
> = Arr extends CustomArray<infer T, infer Size>
  ? SizeHasN<Size, 0> extends true
    ? CustomArray<T, DecrementSize<Size>> :
    never
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

export function getElement<
  T,
  N extends Sizes,
  Size extends Sizes
>(
  n: N,
  arr: SizeHasN<Size, N> extends true
    ? CustomArray<T, Size>
    : never
): GetElementReturn<typeof arr, N> {
  return arr[__type].elements[n] as GetElementReturn<
    typeof arr,
    N
  >;
}
