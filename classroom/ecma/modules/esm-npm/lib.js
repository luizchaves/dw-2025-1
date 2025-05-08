export function sum(a, b) {
  return a + b;
}

export const minus = function (a, b) {
  return a - b;
};

export const multiply = (a, b) => {
  return a * b;
};

export const divide = (a, b) => a / b;

export function summation(...args) {
  let sum = 0;

  for (const value of args) {
    sum += value;
  }

  return sum;
}

export function pow(base, exponent = 1) {
  return base ** exponent;
}

export default {
  sum,
  minus,
  multiply,
  divide,
  summation,
  pow,
};
