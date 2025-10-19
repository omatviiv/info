function loadModule(filename, module, require) {
  const wrappedSrc = `(function (module, exports, require) {
    ${fs.readFileSync(filename, 'utf8')}
  })(module, module.exports, require);`;
  eval(wrappedSrc);
}

function require(moduleName) {
  console.log(`require invoked for moudle: ${moduleName}`);
  const id = require.resolve(moduleName);

  if (require.cache[id]) {
    return require.cache[id].exports;
  }

  // mdoule metadata
  const module = {
    exports: {},
    id,
  };

  // update the cache
  require.cache[id] = module;

  // load the module
  loadModule(id, module, require);

  // return exported variables
  return module.exports;
}

require.cache = {};
require.resolve = (moduleName) => {
  // resolve a full module id from module name
};
