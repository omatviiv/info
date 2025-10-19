// when using namespace import of a module with default export we can clearly
// see that default export name is reserved word 'default':
import * as logger from './defaultExport.mjs';
// import logger from '/Users/omatviiv/info/nodejs/tryESM/defaultExport.mjs';

console.log(logger);

// dynamic async import
const module = await import('./defaultExport.mjs');
module.default('dynamic import worked!');
