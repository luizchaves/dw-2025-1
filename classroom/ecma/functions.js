// function declaration
function sum(a, b) {
  return a + b;
}

console.log(sum(2)); // NaN
console.log(sum(2, 1)); // 3
console.log(sum(2, 1, 1)); // 2

// function expression
const minus = function (a, b) {
  return a - b;
};

console.log(minus(2, 1)); // 1

// arrow function
const multiply = (a, b) => {
  return a * b;
};

console.log(multiply(2, 1)); // 2

// arrow function with implicit return
const divide = (a, b) => a / b;

console.log(divide(2, 1)); // 2

// spread operator
function summation(...args) {
  let sum = 0;

  for (const value of args) {
    sum += value;
  }

  return sum;
}

console.log(summation(1)); // 1, args = [1]
console.log(summation(1, 2)); // 3, args = [1, 2]
console.log(summation(1, 2, 3)); // 6, args = [1, 2, 3]
console.log(summation(1, 2, 3, 4)); // 10, args = [1, 2, 3, 4]

// default parameter
function pow(base, exponent = 1) {
  return base ** exponent;
}

console.log(pow(2)); // 2, exponent = 1
console.log(pow(2, 3)); // 8, exponent = 3

// callback
function calc(a, b, operator) {
  return operator(a, b);
}

console.log(calc(2, 3, sum)); // 5
console.log(calc(2, 3, minus)); // -1
console.log(calc(2, 3, multiply)); // 6
console.log(calc(2, 3, divide)); // 0.6666666666666666
console.log(calc(2, 3, pow)); // 8
console.log(calc(2, 3, (a, b) => a % b)); // 2
