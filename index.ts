const __type = Symbol("CustomArray");
// type __Type = typeof __type;

type Zero = { readonly t: "Zero"; readonly p: never };
const Zero: Zero = { t: "Zero", p: undefined as never };

type Positive = { readonly t: "Positive"; readonly p: Peano };
type Peano = Zero | Positive;

type Succ<T extends Peano> = {
  readonly t: "Positive";
  readonly p: T;
};
const Succ = <T extends Peano>(p: T): Succ<typeof p> => {
  return {
    t: "Positive",
    p,
  };
};

type Prev<T extends Peano> = T extends Positive ? T["p"] : never;
const Prev = <T extends Peano>(t: T): Prev<T> =>
  t.t === "Positive" ? (t.p as Prev<T>) : (undefined as never);

type Add<A extends Peano, B extends Peano> = {
  0: B;
  otherwise: Add<Prev<A>, Succ<B>>;
}[A extends Zero ? 0 : "otherwise"];
const Add = <A extends Peano, B extends Peano>(a: A, b: B): Add<A, B> => {
  if (a.t === "Zero") {
    return (b as unknown) as Add<A, B>;
  } else if (b.t === "Zero") {
    return (a as unknown) as Add<A, B>;
  } else {
    return (Add(Prev(a), Succ(b)) as unknown) as Add<A, B>;
  }
};

type Compare<A extends Peano, B extends Peano> = A extends Zero
  ? B extends Zero
    ? { EQ: true; GT: false; LT: false }
    : { EQ: false; GT: false; LT: true }
  : B extends Zero
  ? { EQ: false; GT: true; LT: false }
  : {
      EQ: Compare<Prev<A>, Prev<B>>["EQ"];
      GT: Compare<Prev<A>, Prev<B>>["GT"];
      LT: Compare<Prev<A>, Prev<B>>["LT"];
    };

type GreaterThan<A extends Peano, B extends Peano> = Compare<A, B>["GT"];
// type LessThan<A extends Peano, B extends Peano> = Compare<A, B>["LT"];
// type EqualTo<A extends Peano, B extends Peano> = Compare<A, B>["EQ"];

// type Subtract<A extends Peano, B extends Peano> = EqualTo<A, B> extends true
//   ? Zero
//   : LessThan<A, B> extends true
//   ? never
//   : B extends Zero
//   ? A
//   : { result: Subtract<Prev<A>, Prev<B>> }[A extends any ? "result" : never];

const peanoToNumber = (p: Peano, count = 0): number => {
  if (p.t === "Zero") {
    return count;
  } else {
    return peanoToNumber(p.p, count + 1);
  }
};

export const _0 = Zero;
export const _1 = Succ(_0);
export const _2 = Succ(_1);
export const _3 = Succ(_2);
export const _4 = Succ(_3);
export const _5 = Succ(_4);
export const _6 = Succ(_5);
export const _7 = Succ(_6);
export const _8 = Succ(_7);
export const _9 = Succ(_8);
export const _10 = Succ(_9);

export function numberToPeano(n: 0, count?: Peano): typeof _0;
export function numberToPeano(n: 1, count?: Peano): typeof _1;
export function numberToPeano(n: 2, count?: Peano): typeof _2;
export function numberToPeano(n: 3, count?: Peano): typeof _3;
export function numberToPeano(n: 4, count?: Peano): typeof _4;
export function numberToPeano(n: 5, count?: Peano): typeof _5;
export function numberToPeano(n: 6, count?: Peano): typeof _6;
export function numberToPeano(n: 7, count?: Peano): typeof _7;
export function numberToPeano(n: 8, count?: Peano): typeof _8;
export function numberToPeano(n: 9, count?: Peano): typeof _9;
export function numberToPeano(n: 10, count?: Peano): typeof _10;
export function numberToPeano(n: number, count?: Peano): never;
export function numberToPeano(n: number, count: Peano = Zero): Peano {
  if (n === 0) {
    return count;
  } else if (n < 0) {
    throw Error();
  } else {
    const newS: Succ<typeof count> = {
      t: "Positive",
      p: count,
    };
    return numberToPeano(n - 1, newS);
  }
}

numberToPeano(123);

export type CustomArray<T = unknown, Size extends Peano = Peano> = {
  [__type]: {
    readonly t?: T;
    readonly s: Size;
    readonly elements: ReadonlyArray<T>;
  };
};

type GetElementReturn<
  Arr extends CustomArray,
  N extends Peano
> = Arr extends CustomArray<infer T, infer Size>
  ? GreaterThan<Size, N> extends true
    ? T
    : undefined
  : never;

export function makeArray<T>(): CustomArray<T, Zero> {
  return {
    [__type]: { s: Zero, elements: [] },
  };
}

export function pushElement<T, Size extends Peano>(
  element: T,
  arr: CustomArray<T, Size>
): CustomArray<T, Succ<Size>> {
  const { elements, s } = arr[__type];
  const newS: Succ<Size> = {
    t: "Positive",
    p: s,
  };
  return {
    [__type]: {
      s: newS,
      elements: [...elements, element],
    },
  };
}

export function popElement<T, Size extends Positive>(
  arr: CustomArray<T, Size>
): CustomArray<T, Prev<Size>> {
  const { elements, s } = arr[__type];

  return {
    [__type]: {
      s: s.p as Prev<Size>,
      elements: elements.slice(0, -1),
    },
  };
}

export function getElement<T, N extends Peano, Size extends Peano>(
  N: N,
  arr: GreaterThan<Size, N> extends true ? CustomArray<T, Size> : never
): GetElementReturn<typeof arr, N> {
  const n = peanoToNumber(N);
  return arr[__type].elements[n] as GetElementReturn<typeof arr, N>;
}

