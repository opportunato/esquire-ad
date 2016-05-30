'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const concatCss = require('gulp-concat-css');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const uglify = require('gulp-uglify');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');

const postcss = require('gulp-postcss');

const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const variables = {
  primaryColor: '#231F20',
  activeColor: '#FF7979',
  mobile: '500px',
  tablet: '900px',
  secondaryFont: "'Geometria', sans-serif",
  mobilePadding: '16px'
};

gulp.task('styles', function() {
  return gulp.src('frontend/styles/main.css')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss([
      require('precss'),
      require('cssnano'),
      require('autoprefixer')({ browsers: ['last 3 versions'] }),
      require('postcss-simple-vars')({ variables: variables })
    ]))
    .pipe(concatCss('main.css'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './frontend/js/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'));
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

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets', 'nunjucks', 'scripts')));

gulp.task('watch', function() {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
  gulp.watch('frontend/data/**/*.*', gulp.series('nunjucks'));
  gulp.watch('frontend/js/**/*.*', gulp.series('scripts'));
  gulp.watch('frontend/(pages|templates)/**/*.*', gulp.series('nunjucks'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build',  gulp.parallel('watch', 'serve')));
