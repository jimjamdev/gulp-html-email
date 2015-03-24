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
var mailer = require('gulp-mailer');
var nodemailer = require('nodemailer');
var util = require('gulp-util');
var fs = require('fs');


var config = require('./mail.config.json');

// Static server
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: "./build"
        }
    });
});



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

gulp.task('inline-css', function() {
    return gulp.src('./app/*.html')
        .pipe(inlineCss())
        //.pipe(inlineimg('./app'))
        .pipe(gulp.dest('build/'));
});

gulp.task('image', function () {
  gulp.src('./app/images/*')
    .pipe(image())
    .pipe(gulp.dest('./build/images'))
    .pipe(size());
});

gulp.task('email', function () {
  return sendEmail('index.html', config.testing.to);
});

gulp.task('watch', ['build','serve'], function() {
    gulp.watch("app/**/*.scss", ['styles']);
    gulp.watch("app/*.html", ['html']);
    gulp.watch("app/*.css", ['html']);
    gulp.watch("app/images/*", ['image']);
    gulp.watch("build/*", ['reload']);
});

gulp.task('styles', ['scss']);
gulp.task('html', ['inline-css']);

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('build', ['inline-css', 'image']);

gulp.task('default', ['watch']);

/** Email **/

function sendEmail(template, recipient) {
    try {

        var options = {
            include_script : false,
            include_style : false,
            compact_whitespace : true,
            include_attributes : { 'alt': true }
        };

        var templatePath = "./build/" + template;

        var transporter = nodemailer.createTransport({
            service: 'Mailgun',
            auth: {
                user: config.auth.mailgun.user,
                pass: config.auth.mailgun.pass
            }
        });

        var templateContent = fs.readFileSync(templatePath, encoding = "utf8");

        var mailOptions = {
            from: config.testing.from, // sender address
            to: recipient, // list of receivers
            subject: config.testing.subject + ' - ' + template, // Subject line
            html: templateContent // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return util.log(error);
            }else{
                return util.log('Message sent: ' + info.response);
            }
        });

    } catch (e) {
        if(e.code == 'ENOENT') {
            util.log('There was an error. Check your template name to make sure it exists in ./build');
        } else if(e instanceof TypeError) {
            util.log('There was an error. Please check your config.json to make sure everything is spelled correctly');
        } else {
            util.log(e);
        }
    }
}
