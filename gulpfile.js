var gulp = require('gulp');
var browserSync = require('browser-sync');
var inlineCss = require('gulp-inline-css');
var sass = require('gulp-sass');
var cmq = require('gulp-combine-media-queries');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');
var size = require('gulp-size');
var notify = require('gulp-notify');
var inlineimg = require('gulp-inline-image-html');
var image = require('gulp-image');

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
        .pipe(sass({
              errLogToConsole: false,
              onError: function(err) {
                return notify().write(err);
              }}
        ))
        .pipe(autoprefixer('last 20 version'))
        .pipe(cmq())
        .pipe(gulp.dest('./app'))
        .pipe(size());
        //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('inline-css', ['image'], function() {
    return gulp.src('./app/*.html')
        .pipe(inlineCss())
        //.pipe(inlineimg('./app'))
        .pipe(gulp.dest('build/'));
});

gulp.task('image', function () {
  gulp.src('./app/images/*')
    .pipe(image())
    .pipe(gulp.dest('./build/images'));
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
