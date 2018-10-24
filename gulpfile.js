(function () {
  'use strict';
  var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    cleancss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    htmlclean = require('gulp-htmlclean'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev-append'),
    sequence = require('gulp-sequence'),
    PATHS = {
      ROOT: './',
      DEST: './dist/',
      HTML: '**/*.{html,htm}',
      CSS: '**/*.css',
      IMG: '**/*.{png,jpg,gif,ico}',
      JS: '**/*.js'
    }
  /*====================================================
      部署前代码处理
  ====================================================*/

  var conditionJs = function (f) {
    if (f.path.endsWith('.min.js')) {
      return false;
    }
    return true;
  };
  var conditionCss = function (f) {
    if (f.path.endsWith('.min.css')) {
      return false;
    }
    return true;
  };

  // 压缩处理 css
  gulp.task('minify-css', function () {
    return gulp.src([PATHS.CSS,'!./dist/**', '!./node_modules/**'])
      .pipe(sourcemaps.init())
      .pipe(autoprefixer({
        browsers: ['last 10 versions', 'Firefox >= 20', 'Opera >= 36', 'ie >= 9', 'Android >= 4.0', ],
        cascade: true, //是否美化格式
        remove: false //是否删除不必要的前缀
      }))
      .pipe(gulpif(conditionCss, cleancss({
        keepSpecialComments: '*' //保留所有特殊前缀
      })))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(PATHS.DEST))
      .pipe(notify({ message: 'css minify complete' }));
  });

  // 压缩处理 img
  gulp.task('minify-img', function () {
    return gulp.src([PATHS.IMG,'!./dist/**', '!./node_modules/**'])
      .pipe(cache(imagemin()))
      .pipe(gulp.dest(PATHS.DEST));
  })

  // 压缩处理 js
  gulp.task('minify-js', function () {
    return gulp.src([PATHS.JS, '!./dist/**', '!./node_modules/**', '!gulpfile.js'])
      .pipe(sourcemaps.init())
      .pipe(gulpif(conditionJs, uglify()))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(PATHS.DEST))
      .pipe(notify({ message: 'js minify complete' }));
  });

  // 压缩处理 html
  gulp.task('minify-html', function () {
    return gulp.src([PATHS.HTML,'!./dist/**', '!./node_modules/**'])
      .pipe(htmlclean())
      .pipe(htmlmin({
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        minifyJS: true, //压缩页面JS
        minifyCSS: true, //压缩页面CSS
        minifyURLs: true
      }))
      .pipe(gulp.dest(PATHS.DEST));
  });

  // 添加版本号
  gulp.task('rev', function () {
    return gulp.src([PATHS.HTML,'!./dist/**', '!./node_modules/**'])
      .pipe(rev())
      .pipe(gulp.dest(PATHS.DEST));
  });

  // 同步执行task
  gulp.task('deploy', sequence(['minify-css', 'minify-js'], 'minify-img', 'rev', 'minify-html'));

  // 部署前代码处理
  gulp.task('default', ['deploy'], function (e) {
    console.log("[complete] Please continue to operate");
  })
})();
