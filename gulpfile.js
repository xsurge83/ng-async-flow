var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename");

var ngAnnotate = require('gulp-ng-annotate');

gulp.task('build', function () {
    return gulp.src('src/asyncFlow.js')
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'));
});