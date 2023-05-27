export type Write<T, U> = Omit<T, keyof U> & U;
export type Cast<T, U> = T extends U ? T : U;
export type EntriesOf<T> = [keyof T, Required<T>[keyof T]][];
export type NonogramGrid = Array<Array<number>>;
export type Point = [number, number];
export type Vector4D = [number, number, number, number];
export type KeyCombo = [string[], string | null];
