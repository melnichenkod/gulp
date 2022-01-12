const gulp = require('gulp');

const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const cleanCSS = require('gulp-clean-css');
const del = require('delete');

const outputDir = 'static';

const isProduction = process.env.NODE_ENV === 'production';

const srcHTML = 'src/**/*.html';
const srcCSS = 'src/**/*.css';
const srcJS = 'src/**/*.js';
const srcImages = ['src/**/*.svg', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.png'];

function server() {
  return connect.server({
    port: 3000,
    host: '0.0.0.0',
    root: 'static/',
    livereload: true
  });
}

function clean(cb) {
  del([outputDir], cb);
}

function html() {
  return gulp.src(srcHTML)
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(outputDir))
      .pipe(gulpif(!isProduction, connect.reload()));
}

function css() {
  return gulp.src(srcCSS)
      .pipe(cleanCSS())
      .pipe(gulp.dest(outputDir))
      .pipe(gulpif(!isProduction, connect.reload()));
}

function images() {
  return gulp.src(srcImages)
      .pipe(gulpif(isProduction, imagemin()))
      .pipe(gulp.dest(outputDir))
      .pipe(gulpif(!isProduction, connect.reload()));
}

function js() {
  return gulp.src(srcJS)
      .pipe(gulpif(isProduction, uglify()))
      .pipe(gulp.dest(outputDir))
      .pipe(gulpif(!isProduction, connect.reload()))
}

function watch() {
  gulp.watch(srcJS, gulp.series(js));
  gulp.watch(srcCSS, gulp.series(css));
  gulp.watch(srcImages, gulp.series(images));
  gulp.watch(srcHTML, gulp.series(html));
}

exports.server = server;
exports.clean = clean;
exports.build = gulp.series(clean, js, html, images, css);
exports.dev = gulp.parallel(
    watch,
    gulp.series(clean, js, html, css, images, server)
); 