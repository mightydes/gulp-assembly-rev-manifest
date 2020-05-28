# gulp-assembly-rev-manifest

---
## Usage

```js
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.src(['app.js', 'app-lib.js'])
    .pipe($.assemblyRevManifest())
    .pipe(gulp.dest('assets'));
```

This will output:

*   app.js
*   app.js.rev.txt -- containing hash sum
*   app-lib.js
*   app-lib.js.rev.txt -- containing hash sum
