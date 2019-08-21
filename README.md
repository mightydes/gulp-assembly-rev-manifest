# gulp-assembly-rev-manifest

---

## Usage

```js
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.src('...')
    // ...
    .pipe($.concat('sample.js'))
    .pipe($.assemblyRevManifest())
    .pipe(gulp.dest('...'));

// Outputs -> 'sample.js.rev.txt' with the calculated hash slug inside.

```

---
