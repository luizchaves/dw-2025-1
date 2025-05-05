// const, let
const value = 10;

console.log(value); // 10

// 'const' declarations must be initialized.
// const number;

// TypeError: Assignment to constant variable.
// value = 20;

// let number = 10;
let number;

console.log(number); // undefined

number = 20;
console.log(number); // 20

number = false;
console.log(number); // false

// Cannot redeclare block-scoped variable 'value'.
// let value = 10;

function test() {
  let value = 20;
  console.log(value); // 20
}

var variable = 10;
console.log(value); // 10
