import {count, increment} from './counter.mjs';

console.log(`Initial count: ${count}`);
increment(); // count can be incremented via methods of the module
console.log(`Count after increment: ${count}`);
count++; // but direct modification throws an error as if count is a constant
