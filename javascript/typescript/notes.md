# Quickly start react project with typescript as build tool
As typescript converts code from typescript into javascript so it can be
used as a simple build tool to bundle and transform code (for more
complicated cases its better to use webpack).

1. initialize npm repository: `npm init`
2. install typescript: `npm i -D typescript`
3. create default tsconfig.json `npx tsc --init`
4. config typescript compiler in tsconfig.json
  - specify where to emit compiled files
    `"outDir": "./dist",`
5. add npm scripts for more convenient development:
```
  "build": "tsc",
  "dev": "tsc --watch",
```
By default tsc looks for ts files everywhere considering folder where
tsconfig.json is to be root dir.

# Configure typescript with webpack and babel
This configuration is demonstrated on styleagnostic/react-template

There is one gotcha with typescript and webpack. @babel/preset-typescript
package simply ignores typescript for better build performance. So type
checking should happen separately like: npm run typecheck:watch.
