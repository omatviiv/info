KISS - Keep It Simple, Stupid a principle adopted by nodejs.
It claims that its better to have a simple solution faster than a perfect
complex in maintenance solution. No matter how hard we try to create a complex
class hierarchy to create near perfect solution it will always be only an
approximation of the real world so its much more important to implement
simple working solution than chase perfection implementing complex solution
which will be hard to implement and maintain.

Modularity - nodejs core contains only bare minimum functionality and
and everything else users can add via modules (npm or yarn tools). Modules
tend to exopose minimal interface to minimize error and internals are hidden.
This ensures reliablity over module extensibility.




# General
The heart of asynchronous nature of nodejs lies in Reactor pattern.
implements single threaded and non-blocking I/O (input/output) model.

I/O is slow:
- accessing RAM measures in nanoseconds (10E-9)
- writing to disk measures in milliseconds (10E-3)

In traditional programming languages I/O operations are blocking program
execution so the server will need multiple threads to handle multiple requests.

**Busy waiting**
**example:** `./reactorPattern/nonBlockingPollingLoop.js`
This example allows to process different resources in a single thread but its
not very efficient as this loop will be consumint lots of CPU while polling.

**Event demultiplexing**
Modern operating systems are natively providing a mechanism for concurent
non-blocking resources handling. **Multiplexing** is a mechanism used in
telecomunications when multiple signals are combined into one to reuse
bandwidth. **Demultiplexing** is the reverse process.
**example:** `./reactorPattern/synchronousEventDemultiplexer.js`
This is called the **event loop** which allows to process multiple resources
in a single thread without busy waiting. Single threaded event loop allows
developers to handle concurencly much rore simple.


## Reactor pattern:
```
                   -------------------------------------------
                  |                Application                |
                  |                                           |
           1      |  -------------    5b    ----------------- |
          --------|-| Request I/O |<-------| Execute Handler ||
         |        |  -------------          ----------------- |
         |        |                          |                |
         |         -------------------------------------------
         |                                   | ^ 
         v                                5a | | 4
  -------------------------------            v |          ------------------
 |      Event Demultiplexer      |         -----         |    Event Queue   |
 | [Resouce, Operation, Handler] |   6    |Event|    3   | [Event, Handler] |
 | [Resouce, Operation, Handler] |<-------|Loop |<-------| [Event, Handler] |
 | ...                           |         -----         | [Event, Handler] |
  -------------------------------                        | ...              |
                |                                         ------------------
                |                                                  ^
                |        2                                         |
                 --------------------------------------------------
```
1. Application submits a request to Event Demultiplexer to generate new I/O
operation specifying a handler (callback) which will be executed when the
operation completes. This is non-blocking (asynchronous) operation which
immediatelly returns control to the application.
2. When a set of I/O operations completes the Event Demultiplexer pushes
a set of events to the Event Queue.
3. Event Loop iterates over the events in the Event Queue.
4. For each event Event Loop executes the corresponding handler (callback).
5. When handler gives back control to the Event Loop when it completes (5a).
But during handler execution a new async action can be invoked (5b) which
results in new I/O operation being submitted to the Event Demultiplexer.
Which triggers another sycle and new event is added to the queue...
6. When all events are processed the Event Loops blocks again on the
Event Demultiplexer waiting for new events.
**Node application will exit when Demultiplexer and Event Queue are empty.**


## libuv
Each operation system has its own demultiplexer implementation:
- Linux - `epoll`
- MacOS - `kqueue`
- Windows - `IOCP` I/O Completion Port
But in fact depending on operation system and type of resource I/O operation
can behaive differently, for example in unix systems regular filesystem
files do not support non-blocking I/O and a separate thread is required.
Because of these type of inconsistencies nodejs core team create native
library `libuv`. This library is part of nodejs core and is one of the most
important parts of nodejs.

`libuv` implements the Reactor pattern and abstracts the underlying system
calls.


## nodejs architecture
```
        ------------------------------------
       | Userland modules and applications  |
        ------------------------------------

        ------------------------------------
       |              Node.js               |
       |  ---------------------   --------  |
       | | Core JavaScript API | |        | |
       |  ---------------------  |        | |
       |  ---------------------  |        | |
       | | Bindings            | |   V8   | |
       |  ---------------------  |        | |
       |  ---------------------  |        | |
       | | libuv               | |        | |
       |  ---------------------   --------  |
        ------------------------------------
```
- Userland modules - modules installed via npm or yarn
- applications - application that user is developing
- Core JavaScript API - modules that come with nodejs core
- Bindings - glue code between C/C++ and JavaScript - a set of bindings
responsible for wrapping and exposing libuv and other low level functionalities
- V8 - javascript engine developed by Google for Chrome browser, famous for
its revolutionary design, speed and eficient memory management.
- libuv - see [above](#libuv)


## nodejs environments
- Browser - browser limits access to system resources for security reasons
and abstracts away providing available functionality via window object or DOM.
We have to transpile code to be compatible with different engines of javascript
- Node.js - nodejs does provides access to system resources and ofcourse
there is no window or document objects. Its much easier in terms of
compatibility since we know for sure which engine is going to be used on prod
but in case we are developing a library we have to support some older engines.
Common approach is to support oldest LTS version of nodejs and mention in
in `package.json` via `engines` field. This will cause npm to throw a warning
when user would attempt to install our library on older engine.




# Modules
Nodejs on server side has access to many system services via core modules,
full list is [here](https://nodejs.org/docs/latest/api/):
- `fs` - filesystem access
- `http` - http server and client
- `https` - https server and client
- `net`, `dgram` - low level TCP and UDP sockets
- `crypto` - use standard cryptographic algorithms of OpenSSL
- `v8` - access v8 engine internals
- `child_process` - spawn new processes
- `process` - information about current process, like env variables
(process.env) or command line arguments passed to our app (process.argv)

Nodejs has ability to run native C/C++ code to access some low level drivers
or reuse C/C++ libraries. This is done via `N-API` interface and this caused
nodejs popularity in IoT (Internet of Things) and home robotics. Even though
v8 is super fast it still is a bit slower than native code so for some
applications that are using heavy computations it may be beneficial to run
native code.

**Modules benefits:**
- code organisation - each module is in its own file
- code reuse - modules can be reused in different projects
- encapsulation - hiding information - helps to hide implementation
complexity and only exposes simple interface with clear responsibilities
- dependency management - modules can depend on other modules, it is easy
to build on top of other third-party modules


## Module system
Module is a single unit in module system and javascript didn't have any
modules system for a long time. The only way to split code was by using
`<script>` tag where different files could be loaded.

As apps complexity was growing community came up with solutions and most
popular among them were:
- **AMD** - Asynchronous Module Definition - check it
[here](https://requirejs.org/) - designed to be used in browsers, first
popular attempt to define module system for javascript
- **UMD** - Universal Module Definition - check it
[here](https://github.com/umdjs/umd) - came later after AMD
- **CJS** - CommonJS - created when Node.js was developed and there was a
chance to implement module system from scratch based on file location in the
local system (where application actually runs). But this system was used
in browser applications as well via bundlers like webpack or browserify.
- **ESM** - ECMAScript Modules - with ECMAScript 6 (ES2015) finally there was
an official module system proposal which aimed to close the gap between how
moduels were used in browsers and servers. It was only a proposal and it took
couple of years for browser companies and nodejs core team to come up with
solid implementation. So the only node 13.2 and above support ESM natively.


## CommonJS
One of the biggest problems in javascript in browser was lack of namespaces.
Every library can create global variables and functions which can result in
unexpected behaivor when two libraries reuse same variables or call
each other functions unintentionally.

To solve this a **revealing module pattern** (main idea for CommonJS) was used
see an example here: `./revealingModulePattern/index.js`
This pattern uses **self-invoking function** or **IIFE** (Immediately Invoked
Function Expression) to create a closure which encapsulates private things
and exposes only public interface creating one global variable - a namespace
for our module. But since there is inner scope inside that self-invoking
function what is inside is practically inaccessible from outside thus ensuring
that nobody will call some internal function unintentionally.

`require()` - syncronous function that allows to import file from local
filestystem.
`exports` and `module.exports` - special variables that can be used to export
public functionality from the module.

As require is synchronous you couldn't export anythig asynchronous from the
module. There was assynchronous version of require implemente but it was
overcomplicating things and wasn't widely used. Another disadvantage of CJS
is in troublesome handing of circular dependencies.


## ECMAScript Modules
**ESM is for server and browser**, while CJS was mainly for server side.

**ESM is static**. All imports should be at the top of the file and any
dynamicness is not allowed, no variables as import path, no conditional
imports. Even though this seems like a limitation comparing to CJS dynamic
require, but it allows some serious benefits like **tree shaking** - removing
dead code elimination: assume module has few named exports and our app
imports only one of them, then all the others are dead code and should not
be included in the resulting bundle.

**.js** - nodejs will treat every .js file as CJS by default.
**.mjs** - nodejs will treat every .mjs file as ESM module. While you still
can use ESM with .js files by adding `"type": "module"` to package.json

**export** - keyword to export public functionality from the module.
Eventhing that is not exported is private.

**namespace import** - import everything from the module as a single object
```mjs
import * as loggerModule from './logger.mjs';
```
*In ESM we have to specify file extension, while in CJS it is optional*

**named import** - import only specific exports from the module
```mjs
import { log, info } from './logger.mjs';
```
to avoid name conflicts we can use `as` keyarword to rename imports
```mjs
import { log as logMessage, info as infoMessage } from './logger.mjs';
const log = (msg) => console.log(`Custom log: ${msg}`);
const info = (msg) => console.info(`Custom info: ${msg}`);
```

**default export** - each module can have only one default export, something
similar to `module.exports = function() {...}` in CJS which allows developers
encourage single-responsibility principle.
```mjs
export default class Logger {
 constructor(name) {
   this.name = name;
 }
 log(msg) {
   console.log(`[${this.name}] ${msg}`);
 }
}
```
*if module exports single big object its not possible to remove dead code
when only parts of that big object are used so in these terms named
exports are better*

**default import** - exported class name (or function, object) is ignored
and replaced with special name `default` so that new name can be given
during import
```mjs
import MyLogger from './logger.mjs';
```

**mixed import**
```mjs
import MyLogger, { log, info } from './logger.mjs';
```

**module specifiers** - module path can start with:
- relative specifiers - `./logger.mjs` or `../utils/logger.mjs`
- absolute specifiers - `/` or `file:///opt/app/logger.mjs`
- bare specifiers - `lodash` or `express`
- deep import specifiers - `lodash/map.mjs` or `express/lib/router.mjs`
- URL specifiers - `https://example.com/logger.mjs` *only in browsers*

**asynchronous import()** - dynamic import function that returns a promise
```mjs
const module = await import('./defaultExport.mjs');
module.default('Dynamic import worked!');
```
There are cases when this is going to be useful: we need to load a heavy
module only when user access some certain part of our app functionality...
Or we have an app that supports huge amount of languages and for every
specific user it only makes sence to load one preferred language...

**module loading in ESM** as imports are static module loading can be done
in phases to build a **dependency graph**.
1. Construction - traverses recursively all imports starting from the
**entry point** which is basically the file we pass as argument to node
executable. It goes through every import and load each module content into
the graph.
2. Instantiation - creates named references for all exports but
doesn't assign values yet (this helps to handle circular dependencies).
This is also called linking because after creating named uninicialized
references for all exports it then links them with imports.
No javascript executed yet.
3. Evaluation - executes the code so that all instantiated references get
their values assigned. Evaluation then happens from bottom to top i.e.
the top most node of the graph (the entry point) is executed last.

**read-only live bindings** - imported modules are read-only live bindings
to their values, i.e. you can't change imported variables directly. But
if module exports an object its possible to change its properties though but
its not recommended to do so.
This feature also helps to handle circular dependencies.
See example:
- `./readOnlyLiveBindings/counter.mjs`
- `./readOnlyLiveBindings/main.mjs`
Circular dependencies example:
- `./circularDependencies/a.mjs`
- `./circularDependencies/b.mjs`
- `./circularDependencies/main.mjs`




# Callback pattern
Callback - a function that is passed as an argument to another function and
is invoked inside that function when some action completes.
Callbacks are basically the same thing what handlers are in Reactor pattern.
In functional programming this is called continuation-passing style (CPS).

**direct style**
```mjs
function addDirect(a, b) {
  return a + b;
}
```
**synchronous CPS**
```mjs
function addCps(a, b, callback) {
  callback(a + b);
}
```
**asynchronous CPS**
```mjs
function addAsyncCps(a, b, callback) {
  setTimeout(() => callback(a + b), 100);
}
```
as you can see in both CPS and non-CPS cases syntax for callbacks is the same
that is why it has to be mentioned in the documentation what kind of callback
style is used. For example array map function uses non-CPS callback:
```mjs
[1, 2, 2].map((item) => item * 2); // [2, 4, 6]
// callback is executed synchronously for every item in the array
```

**closure** - nested functions have access to variables of their parent
functions even after parent function has finished execution.
So closure is a combination of a function and its lexical environment in
which that function was declared. Check more
[here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)

Closues are very helpful for callback since even when a callback is invoked
after parent function has finished its execution it still has access to
all of the variables of the parent function and can execute fine.
setTimeout adds task to the Event Queue that is executed after specified
delay in milliseconds, addAsyncCps will finish execution before callback
starts its execution but callback still has access to a and b variables.




# Observer pattern
