'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const concatCss = require('gulp-concat-css');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');

const postcss = require('gulp-postcss');
const rev = require('gulp-rev');

const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const variables = {
  primaryColor: '#231F20',
  activeColor: '#FF7979',
  mobile: '450px',
  smalltablet: '790px',
  tablet: '915px',
  widescreen: '1350px',
  wrapperWidth: '1410px',
  extrawidescreen: '1800px',
  secondaryFont: "'Geometria', sans-serif",
  mobilePadding: '16px'
};

gulp.task('styles', function() {
  return gulp.src('frontend/styles/main.css')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss([
      require('precss'),
      require('cssnano'),
      require('postcss-simple-vars')({ variables: variables })
    ]))
    .pipe(autoprefixer({
			browsers: ['last 3 versions'],
		}))
    .pipe(concatCss('main.css'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest('public/static/css'))
    .pipe(gulpIf(!isDevelopment, rev.manifest()))
    .pipe(gulp.dest('public/static/css'));
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
    .pipe(gulpIf(isDevelopment, sourcemaps.init({loadMaps: true})))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest('./public/static/js/'))
    .pipe(gulpIf(!isDevelopment, rev.manifest()))
    .pipe(gulp.dest('./public/static/js/'));
});

gulp.task('clean', function() {
  return del('public');
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**')
    .pipe(gulp.dest('public/static'));
});

gulp.task('picturefill', function() {
  return gulp.src('frontend/js/picturefill.min.js')
    .pipe(gulp.dest('./public/static/js/'));
})

gulp.task('nunjucks', function() {
  return gulp.src('frontend/pages/**/*.html')
    .pipe(data(function() { return require('./frontend/data/arma.json') }))
    .pipe(data(function() { return require('./frontend/data/crossfit.json') }))
    .pipe(data(function() { return require('./frontend/data/berlin.json') }))
    .pipe(data(function() { return require('./frontend/data/ufa.json') }))
    .pipe(data(function() { return require('./frontend/data/petersburg.json') }))
    .pipe(data(function() { return require('./frontend/data/seul.json') }))
    .pipe(data(function() { return require('./frontend/data/meta.json') }))
    .pipe(data(function() { return { "production": !isDevelopment } }))
    .pipe(gulpIf(!isDevelopment, data(function() { return { "hash": require('./public/static/css/rev-manifest.json') } })))
    .pipe(gulpIf(!isDevelopment, data(function() { return { "hashJs": require('./public/static/js/rev-manifest.json') } })))
    .pipe(nunjucksRender({
        path: ['frontend/templates']
      }))
    .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets', 'scripts', 'picturefill'), 'nunjucks'));

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
