const
  gulp            = require('gulp')
  , filter        = require('gulp-filter')       // Provide Gulp with a way to filter specific contents
  , newer         = require('gulp-newer')        // Provide Gulp with a way to check and replace files only if they are newer
  , notify        = require('gulp-notify')       // Provide Gulp with a way to create push notifications
  , plumber       = require('gulp-plumber')      // Handle Errors without breaking
  , concat        = require('gulp-concat')       // Handles file concatenation
  , eslint        = require('gulp-eslint')       // ES6 JS/JSX Lineter -- Check for syntax errors
  , babel         = require('gulp-babel')        // ES6+ Transpiler to ES5 for browser compatibility
  , sass          = require('gulp-sass')         // SASS Transpiler
  , minifyCSS     = require('gulp-csso')         // CSS Minifier
  , webpack       = require('webpack-stream')    // JS and CSS Bundler
  //, webpack       = require('gulp-webpack')      // JS and CSS Bundler
  , config        = require('./build.config')
;

const devFolder         = config.devFolder;
const buildFolder       = config.buildFolder;
const assetsFolder      = config.assetsFolder;
const imgFolder         = config.imgFolder;
const fontFolder        = config.fontFolder;
const jsFolder          = config.jsFolder;
const cssFolder         = config.cssFolder;
const bootstrapCSSPath  = config.bootstrapCSSPath;
const bootstrapJSPath   = config.bootstrapJSPath;
const bootstrapFontPath = config.bootstrapFontPath;
const jqueryJSPath      = config.jqueryJSPath;
const jqueryCookiePath  = config.jqueryCookiePath;

const jsSrc = devFolder + assetsFolder + jsFolder + '**';
const imgSrc = devFolder + assetsFolder + imgFolder + '**';
const imgDest = buildFolder + assetsFolder + imgFolder;

// Route Errors to the Notificication Tray
let onError = function(err) {
  notify.onError({
    title:    "Error",
    message:  "<%= error %>",
  })(err);
  this.emit('end');
};

let plumberOptions = {
  errorHandler: onError,
};

// Lint JS/JSX Files (For Express)
gulp.task('eslint', function() {
  return gulp.src([devFolder + '/assets/js/*.js?', 'app/**/*.js?'])
    .pipe(eslint({
      baseConfig: {
        "ecmaFeatures": {
           "jsx": true
         }
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Copy Bootstrap to build/assets
// only if the copy in node_modules is "newer"
gulp.task('copy-bootstrap-js', function() {
  let dest = buildFolder + 'assets/js';
  return gulp.src(bootstrapJSPath)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});
gulp.task('copy-bootstrap-css', function() {
  let dest = buildFolder + 'assets/css';
  return gulp.src(bootstrapCSSPath)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});
gulp.task('copy-bootstrap-fonts', function() {
  let dest = buildFolder + 'assets/fonts';
  return gulp.src(bootstrapFontPath)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});
gulp.task('bootstrap', ['copy-bootstrap-js','copy-bootstrap-css','copy-bootstrap-fonts']);

// Copy jQuery to build/assets (needed for Bootstrap JS)
// only if the copy in node_modules is "newer"
gulp.task('copy-jquery-js', function() {
  let dest = buildFolder + 'assets/js';
  return gulp.src(jqueryJSPath)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});
gulp.task('copy-jquery-cookie-js', function() {
  let dest = buildFolder + 'assets/js';
  return gulp.src(jqueryCookiePath)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});
gulp.task('jquery', ['copy-jquery-js', 'copy-jquery-cookie-js']);

// Copy html files build/**
// only if the copy is newer
gulp.task('html', function() {
  return gulp.src(devFolder + '**/*.html')
    .pipe(newer(buildFolder))
    .pipe(gulp.dest(buildFolder));
});

// Transpile SCSS to CSS
gulp.task('sass', function(){
  return gulp.src(devFolder + '**/*.scss')
    .pipe(plumber())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(plumber.stop())
    .pipe(gulp.dest(buildFolder))
});

// Minify CSS
gulp.task('css', function(){
  return gulp.src(devFolder + '/**/*.css')
    .pipe(plumber())
    .pipe(minifyCSS())
    .pipe(plumber.stop())
    .pipe(gulp.dest(buildFolder))
});

// Images
gulp.task('images', function() {
  return gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(gulp.dest(imgDest));
});

gulp.task('base-js', function() {
  let dest = buildFolder + 'assets/js';
  return gulp.src(jsSrc)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});

// JS lint / babel / sourcemap
gulp.task('js', ['bootstrap', 'jquery', 'base-js', 'eslint'], function() {
  return gulp.src(devFolder + '**/*.js?')
    .pipe(plumber())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(buildFolder));
});

// Webpack
gulp.task('webpack', function() {
  return gulp.src('./app/main.js')
    //.pipe(plumber())
    .pipe( webpack( require('./webpack.config') ) )
    //.pipe(plumber.stop())
    .pipe(gulp.dest(buildFolder));
});

gulp.task('bundle-assets', [ 'html', 'sass', 'css', 'images', 'js' ]);

gulp.task('default', ['bundle-assets', 'webpack']);

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
