var gulp = require('gulp');
var browserSync = require('browser-sync');
var inlineCss = require('gulp-inline-css');
var sass = require('gulp-sass');
var cmq = require('gulp-combine-media-queries');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');
var size = require('gulp-size');

// Static server
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('styles', ['scss']);

gulp.task('scss', function () {
    gulp.src('app/styles/*.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 3 version'))
        .pipe(cmq({
            log: true
        }))
        .pipe(gulp.dest('./app'))
        .pipe(size());
});

gulp.task('inline-css', function() {
    return gulp.src('./app/*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', ['serve'], function() {
    gulp.watch("app/styles/*.scss", ['styles']);
    gulp.watch("app/*", ['inline-css']);
    gulp.watch("build/*.html", ['reload']);
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('build', ['inline-css']);

gulp.task('default', ['watch']);
