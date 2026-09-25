// TOPIC: Modules
//
// Node.js has two module systems: the original CommonJS (`require`/`module.exports`)
// and modern ES Modules (`import`/`export`). This project compiles ES module syntax
// down to CommonJS (see tsconfig.json), which is why both styles below work together.

// Named imports — pulls specific exports out of mathUtils.ts by name.
import { add, multiply } from './mathUtils';
// Default import — pulls the one `export default` out of mathUtils.ts, can be named anything.
import square from './mathUtils';

// This is the CommonJS equivalent of the imports above, for comparison
// (uncomment to try it — both work in this project):
// const { add, multiply } = require('./mathUtils');

console.log('add(2, 3) =', add(2, 3));
console.log('multiply(4, 5) =', multiply(4, 5));
console.log('square(6) =', square(6));
