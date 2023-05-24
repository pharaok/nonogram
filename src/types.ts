export type Overwrite<T, U> = Omit<T, keyof U> & U;
export type EntriesOf<T> = [keyof T, Required<T>[keyof T]][];
export type NonogramGrid = Array<Array<number>>;
export type Point = [number, number];
export type Vector4D = [number, number, number, number];
export type KeyCombo = [string[], string | null];
