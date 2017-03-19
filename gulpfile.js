let gulp = require('gulp');
let browserify = require('gulp-browserify');

gulp.task('default', function() {
    gulp.src('example/example.js')
        .pipe(browserify())
        .pipe(gulp.dest('./docs/'));
});
