var path = require('path');
var del = require('del');
var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');

var paths = {
  source: 'src',
  build: 'build'
};

gulp.task('clean', () => del(paths.build));

gulp.task('copy-package.json', function () {
  return gulp.src('package.json')
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-dotenv', function () {
  return gulp.src('.env.gcloud')
    .pipe(rename('.env'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('build', ['copy-package.json', 'copy-dotenv'], function () {
  return gulp.src(path.join(paths.source, '**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel())
    //.pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build']);
