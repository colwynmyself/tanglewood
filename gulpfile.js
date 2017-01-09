const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const seq = require('gulp-sequence');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const uglifyCss = require('gulp-uglifycss');
const concatCss = require('gulp-concat-css');
const rename = require('gulp-rename');

// General
gulp.task('clean', function() {
    return gulp.src(['./public/css/**/*.*'], { read: false })
        .pipe(rm());
});

gulp.task('lint', function() {
    return gulp
        .src(['public/ts/**/*.ts'])
        .pipe(eslint())
        .pipe(eslint.format());
});

// Frontend
gulp.task('static', function() {
    return gulp
        .src('./public/scss/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: require('node-normalize-scss').includePaths,
        }).on('error', sass.logError))
        .pipe(concatCss('main.css', {
            rebaseUrls: false,
        }))
        .pipe(autoprefix())
        .pipe(gulp.dest('./public/public/css'))
        .pipe(rename('main.min.css'))
        .pipe(uglifyCss())
        .pipe(gulp.dest('./public/public/css'));
});


gulp.task('icons', function() {
    return gulp.src('./bower_components/components-font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('js:frontend', function() {
    return gulp
      .src('./public/ts/**/*.ts')
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('frontend', function(cb) {
    return seq('icons', 'static', 'js:frontend', cb);
});

gulp.task('watch:scss', function() {
    gulp.watch('./public/scss/**/*.scss', ['static']);
});

gulp.task('watch:js', function() {
    gulp.watch('./public/ts/**/*.ts', ['js:frontend']);
});

gulp.task('watch', function(cb) {
    return seq('watch:scss', 'watch:js', cb);
});

gulp.task('default', seq('clean', 'lint', 'frontend'));
