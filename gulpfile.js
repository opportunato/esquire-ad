'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const concat = require('gulp-concat');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');

const postcss = require('gulp-postcss');

const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const variables = {
  primaryColor: '#231F20'
};

gulp.task('styles', function() {
  return gulp.src('frontend/styles/*.css')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat("main.css"))
    .pipe(postcss([
      require('autoprefixer')({ browsers: ['last 3 versions'] }),
      require('postcss-simple-vars')({ variables: variables })
    ]))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('public/css'));
});

gulp.task('clean', function() {
  return del('public');
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**')
    .pipe(gulp.dest('public'));
})

gulp.task('nunjucks', function() {
  return gulp.src('frontend/pages/**/*.html')
    .pipe(data(function() { return require('./frontend/data/arma.json') }))
    .pipe(data(function() { return require('./frontend/data/crossfit.json') }))
    .pipe(data(function() { return require('./frontend/data/group_ib.json') }))
    .pipe(data(function() { return require('./frontend/data/mandalay.json') }))
    .pipe(data(function() { return require('./frontend/data/bakery_brothers.json') }))
    .pipe(data(function() { return require('./frontend/data/zeit_fur_brot.json') }))
    .pipe(nunjucksRender({
        path: ['frontend/templates']
      }))
    .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets', 'nunjucks')));

gulp.task('watch', function() {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
  gulp.watch('frontend/data/**/*.*', gulp.series('nunjucks'));
  gulp.watch('frontend/(pages|templates)/**/*.*', gulp.series('nunjucks'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build',  gulp.parallel('watch', 'serve')));
