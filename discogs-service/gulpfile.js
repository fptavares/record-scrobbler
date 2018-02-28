var path = require('path');
var del = require('del');
var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var install = require('gulp-install');
var lambda = require('gulp-awslambda');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');

var lambda_params = {
	FunctionName: 'discogs',
  Handler: 'lambda.handler',
	Role: 'arn:aws:iam::397540605433:role/service-role/drsServices',
  Runtime: 'nodejs6.10',
  Timeout: 30
};
var opts = {
	region: 'us-east-1'
};

var paths = {
  source: 'src',
  build: 'build',
  dist: 'dist',
  zipfile: 'dist.zip'
};

gulp.task('clean', () => del([paths.build, paths.dist, paths.zipfile]));

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

gulp.task('build-aws-dist', function() {
  return gulp.src([path.join(paths.build, '**/*'), path.join(paths.build, '.*')])
    .pipe(gulp.dest(paths.dist))
    .pipe(install({production: true}));
});

gulp.task('zip-upload-aws', function() {
  return gulp.src([path.join(paths.dist, '**/*'), path.join(paths.dist, '.*')])
    .pipe(zip(paths.zipfile))
    .pipe(lambda(lambda_params, opts))
    .pipe(gulp.dest('.'));
});

gulp.task('build-aws', function(callback) {
  return runSequence(
    'build',
    'build-aws-dist',
    callback
  );
});

gulp.task('deploy-aws', function(callback) {
  return runSequence(
    'clean',
    'build',
    'build-aws-dist',
    'zip-upload-aws',
    callback
  );
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build']);
