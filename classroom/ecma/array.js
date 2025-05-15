// create array
const values = [1, 2, 3, 4, 5];

console.log(values);
console.log(values.length); //=> 5
console.log(values[4]); //=> 5
console.log(values.at(-1)); //=> 5
console.log(values[20]); //=> undefined
console.log(values.includes(5)); //=> true
console.log(values.indexOf(5)); //=> 4
console.log(values.lastIndexOf(5)); //=> 4

// adding values
values.push(6); //=> [1, 2, 3, 4, 5, 6]
values.push(7, 8); //=> [1, 2, 3, 4, 5, 6, 7, 8]
values.unshift(0); //=> [0, 1, 2, 3, 4, 5, 6, 7, 8]
values.unshift(-1, -2); //=> [-1, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8]
values[11] = 9; //=> [-1, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// changing values
values[0] = -10; //=> [-10, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// removing values
values.pop(); //=> 9; [-10, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8]
values.shift(); //=> -10; [-2, 0, 1, 2, 3, 4, 5, 6, 7, 8]
values.splice(0, 2); //=> [-2, 0]; [1, 2, 3, 4, 5, 6, 7, 8]

// slice
console.log(values); //=> [1, 2, 3, 4, 5, 6, 7, 8]
console.log(values.slice(0, 2)); //=> [1, 2]
console.log(values); //=> [1, 2, 3, 4, 5, 6, 7, 8]

// multiple types
const person = [1, true, 'John', ['DW', 'ASA']];

// destructuring arrays
// const name = person[2]; //=> 'John'
// const subjects = person[3]; //=> ['DW', 'ASA']
const [, , name, subjects] = person;
console.log(name); //=> 'John'
console.log(subjects); //=> ['DW', 'ASA']

// spread operator
const student = [...person, 'john@email.com'];
console.log(student); //=> [1, true, 'John', ['DW', 'ASA'], 'john@email.com']

// clone array
const student2 = student;

student2[2] = 'Jane';

console.log(student2); //=> [1, true, 'Jane', ['DW', 'ASA'], 'john@email.com']

console.log(student[2]); //=> 'Jane'

const student3 = [...student];

student3[2] = 'John';

console.log(student3[2]); //=> 'John'
console.log(student[2]); //=> 'Jane'

// iteration
console.log(values); //=> [1, 2, 3, 4, 5, 6, 7, 8]

for (let index = 0; index < values.length; index++) {
  console.log(values[index]); //=> 1, 2, 3, 4, 5, 6, 7, 8
}

for (const value of values) {
  console.log(value); //=> 1, 2, 3, 4, 5, 6, 7, 8
}

for (const index in values) {
  console.log(index); //=> 0, 1, 2, 3, 4, 5, 6, 7
}

for (const [index, value] of values.entries()) {
  console.log(index, value); //=> 0 1, 1 2, 2 3, 3 4, 4 5, 5 6, 6 7, 7 8
}

values.forEach((value, index) => {
  console.log(index, value); //=> 0 1, 1 2, 2 3, 3 4, 4 5, 5 6, 6 7, 7 8
});

// iteration methods
console.log(values); //=> [1, 2, 3, 4, 5, 6, 7, 8]

console.log(values.map((value) => value * 2)); //=> [2, 4, 6, 8, 10, 12, 14, 16]

console.log(values.filter((value) => value > 4)); //=> [5, 6, 7, 8]

console.log(values.reduce((acc, value) => acc + value, 0)); //=> 36
// acc | values | f(acc, value)
// 0   | 1      | 0 + 1 = 1
// 1   | 2      | 1 + 2 = 3
// 3   | 3      | 3 + 3 = 6
// 6   | 4      | 6 + 4 = 10
// 10  | 5      | 10 + 5 = 15
// 15  | 6      | 15 + 6 = 21
// 21  | 7      | 21 + 7 = 28
// 28  | 8      | 28 + 8 = 36

console.log(values.some((value) => value & 1)); //=> true

console.log(values.every((value) => value & 1)); //=> false

console.log(values.find((value) => value > 4)); //=> 5

console.log(values.findIndex((value) => value > 4)); //=> 4

// sort (Tim sort = Merge sort + Insertion sort)
// https://en.wikipedia.org/wiki/Timsort
const numbers = [10, 2, 1];

console.log(numbers.sort()); //=> [1, 10, 2]
console.log(numbers.sort((a, b) => a - b)); //=> [1, 2, 10]
console.log(numbers.sort((a, b) => b - a)); //=> [10, 2, 1]

// reverse
console.log(numbers.reverse()); //=> [1, 2, 10]
