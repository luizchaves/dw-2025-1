// boolean (false, true)
console.log(true);
console.log(false);
// Falsy values
// https://developer.mozilla.org/en-US/docs/Glossary/Falsy
// 0, -0, NaN, '', null, undefined
console.log(Boolean(0));
console.log(Boolean(''));
// https://developer.mozilla.org/en-US/docs/Glossary/Truthiness

// Nullish (null, undefined)
console.log(null);
console.log(undefined);

// Number
console.log(15);
console.log(0o17);
console.log(0xf);
console.log(0b1111);
console.log(3.14);
console.log(314e-2);

// BigInt https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
// MaxSafeInteger
console.log(9007199254740991); // 2 ** 53 - 1
console.log(9007199254740992n); // 2 ** 53

// IEEE 754 https://0.30000000000000004.com/
console.log(0.1 + 0.2); //=> 0.30000000000000004

// string
console.log('Hello, World!');
// console.log("Hello, World!");
console.log(`Hello, World!`);
console.log(`Hello,
  World! ${1 + 1}`);

// array
console.log([1, 2, 3]);
console.log(['Alice', 'alice@email.com', 20]);

// object (JSON)
console.log({ name: 'Alice', email: 'alice@email.com', age: 20 });

// map, set...
