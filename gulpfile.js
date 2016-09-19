let gulp = require('gulp');
let browserify = require('gulp-browserify');
let watchify = require('watchify');

gulp.task('default', function() {
    gulp.src('src/SetsViz.js')
        .pipe(browserify())
        .pipe(gulp.dest('./build/'));
});
