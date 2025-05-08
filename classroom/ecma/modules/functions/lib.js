function sum(a, b) {
  return a + b;
}

const minus = function (a, b) {
  return a - b;
};

const multiply = (a, b) => {
  return a * b;
};

const divide = (a, b) => a / b;

function summation(...args) {
  let sum = 0;

  for (const value of args) {
    sum += value;
  }

  return sum;
}

function pow(base, exponent = 1) {
  return base ** exponent;
}
