export function promptHello() {
    const text = prompt('Enter your name:');
    console.log(`Hello, ${text || 'World'}`);
}
