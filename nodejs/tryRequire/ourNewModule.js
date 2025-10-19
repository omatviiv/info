// load module dependencies
const dependency = require('./anotherModule');

// private function
function log() {
  console.log(`Well done ${dependency.username}`);
}

// public API exported
module.exports = {
  run: () => {
    log();
  }
};
