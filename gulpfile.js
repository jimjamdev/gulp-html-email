var gulp = require('gulp');
var browserSync = require('browser-sync');
var inlineCss = require('gulp-inline-css');
var sass = require('gulp-sass');
var cmq = require('gulp-combine-media-queries');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');
var size = require('gulp-size');
inline_base64 = require('gulp-inline-base64');

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
  gulp.src('app/*.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 20 version'))
        .pipe(cmq())
        .pipe(gulp.dest('./app'))
        .pipe(size());
});

gulp.task('inline-css', function() {
    return gulp.src('./app/*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', ['serve'], function() {
    gulp.watch("app/**/*.scss", ['styles']);
    gulp.watch("app/*.html", ['inline-css']);
    gulp.watch("app/*.css", ['inline-css']);
    gulp.watch("build/*", ['reload']);
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('build', ['inline-css']);

gulp.task('default', ['watch']);
