import { COLORS } from "./colors";

export function randomIntBetween(a: number, b: number) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw Error("Params should both be int numbers");
  }
  if (a > b) {
    throw new Error("First param should be less than or equal to second param");
  }
  return Math.floor(Math.random() * (1 + b - a)) + a;
}

export function deriveFromChaos(prop: "quantity", chaos: number) {
  if (prop === "quantity") {
    switch (true) {
      case chaos > 25:
        return 20;
      case chaos > 50:
        return 40;
      case chaos > 75:
        return 80;
      default:
        return 10;
    }
  }
  throw new Error("prop has to be provided");
}

export const createParticles = ({ quantity }: { quantity: number }) =>
  new Array(quantity).fill("").map((_, i) => {
    return {
      id: i + 1,
      size: randomIntBetween(10, 18),
      moveX: (Math.random() > 0.5 ? 1 : -1) * randomIntBetween(10, 50),
      moveY: (Math.random() > 0.5 ? 1 : -1) * randomIntBetween(10, 50),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });
