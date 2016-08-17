var gulp = require('gulp'),
   browserSync = require('browser-sync'),
   selenium = require('selenium-standalone'),
   webdriver = require('gulp-webdriver'),
   sass = require('gulp-sass'),
   minify = require('gulp-clean-css'),
   autoprefixer = require('gulp-autoprefixer'),
   gp_rename = require('gulp-rename'),
   gp_uglify = require('gulp-uglify'),
   gp_concat = require('gulp-concat'),
   replace = require('gulp-replace'),
   gulpif = require('gulp-if');

/* compile sass */
gulp.task('sass', [], function() {
   return gulp.src('./assets/sass/**/*.scss')
      .pipe(sass({
         sourceComments: true,
         outputStyle: 'expanded',
         errLogToConsole: true
      }))
      .pipe(autoprefixer({
         browsers: ['last 2 versions'],
         cascade: false
      }))
      .pipe(gulp.dest('./app/css/'))
      .pipe(minify({
         keepBreaks: false
      }))
      .pipe(gp_rename({
         suffix: '.min'
      }))
      .pipe(gulp.dest('./app/css/'));
});

/* Bundle javascripts and make minfied version for use in prod */
gulp.task('js', function() {
   return gulp.src(['./assets/javascripts/*.js'])
      .pipe(gp_concat('main.js'))
      .pipe(gulp.dest('./app/js/'))
      .pipe(gp_rename('main.min.js'))
      .pipe(gp_uglify())
      .pipe(gulp.dest('./app/js/'));
});

/* Start local webserver */
gulp.task('serve:static', (done) => {
   browserSync({
      logLevel: 'silent',
      notify: false,
      open: false,
      port: 9005,
      server: {
         baseDir: ['app']
      },
      ui: false
   }, done);
});

/* run selenium */
gulp.task('selenium', function(done) {
   selenium.install({
      logger: function(message) {}
   }, function(err) {
      if (err) return done(err);
      selenium.start(function(err, child) {
         if (err) return done(err);
         selenium.child = child;
         done();
      });
   });
});

/* init selenium using wdio.config */
gulp.task('integration', ['selenium'], function() {
   return gulp.src('wdio.conf.js')
      .pipe(webdriver()).on('error', () => {
         selenium.child.kill();
         browserSync.exit();
         process.exit(1);
      });
});

/* build fresh versions of assets and spawn local webserver / selenium tests */
gulp.task('test', ['sass', 'js', 'serve:static', 'integration'], function() {
   selenium.child.kill();
   browserSync.exit();
});

/* Watch folders and trigger resource builds (sass and javascripts) */
gulp.task('watch', function() {
   gulp.watch('assets/javascripts/**/*.js', ['js']);
   gulp.watch('assets/sass/**/*.scss', ['sass']);

});

/* Default task, development only */
gulp.task('default', ['sass', 'js', 'watch'], function() {

});
