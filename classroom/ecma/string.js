// String ', ", `
// DSK01LB65-JP
console.log('DSK01LB65-JP');
// console.log("DSK01LB65-JP");
console.log(`DSK01LB65-JP`);

// Concat
// IP: 192.168.0.1
// Mask: 255.255.255.0
const ip = '192.168.0.1';
const mask = '255.255.255.0';

console.log('IP: ' + ip + '\nMask: ' + mask);

// Template literals / Template strings
// multi-line strings
// string interpolation
console.log(`IP: ${ip}\nMask: ${mask}`);
console.log(`IP: ${ip}
Mask: ${mask}`);

// Array of characters (immutable)
const desktop = 'dsk01lb65-jp';

console.log(desktop[0]); //=> d

desktop[0] = 'D';

console.log(desktop); //=> dsk01lb65-jp

console.log(desktop[0].toUpperCase() + desktop.slice(1).toLowerCase()); // Dsk01lb65-jp

// Object String

// String.length
console.log(desktop.length); // 12

// String.split / Array.join
// 192.168.0.1, 192.168.0.2, 192.168.0.3
const ips = '192.168.0.1, 192.168.0.2, 192.168.0.3';

// IP: 192.168.0.1
// IP: 192.168.0.3
// IP: 192.168.0.2
console.log(ips.split(', ')); // ['192.168.0.1', '192.168.0.2', '192.168.0.3']

ips.split(', ').forEach((ip) => {
  console.log(`IP: ${ip}`);
});

// String.toLowerCase
console.log(desktop.toUpperCase()); // DSK01LB65-JP

// String.includes
// JP?
console.log(desktop); // dsk01lb65-jp
console.log(desktop.includes('jp')); // true

// String.match
// /\d+\.\d+\.\d+\.\d+/
// 192.168.0.1, 192.168.0.2, 192.168.0.3
console.log(
  '192.168.0.1, 192.168.0.2, 192.168.0.3'.match(/\d+\.\d+\.\d+\.\d+/g)
); // ['192.168.0.1', '192.168.0.2', '192.168.0.3']

// String.padStart
// DSK01LB65-JP => DSK001LB065-JP
console.log(desktop); // DSK01LB65-JP

const pc = 1;
const lab = 65;
const campus = 'jp';

const formattedPc = String(pc).padStart(3, 0);
const formattedLab = String(lab).padStart(3, 0);

// DSK001LB065-JP
console.log(`DSK${formattedPc}LB${formattedLab}-${campus.toUpperCase()}`); // DSK001LB065-JP
