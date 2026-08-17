export function randomIntBetween(a: number, b: number) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw Error("Params should both be int numbers");
  }
  if (a > b) {
    throw new Error("First param should be less than or equal to second param");
  }
  return Math.floor(Math.random() * (1 + b - a)) + a;
}
