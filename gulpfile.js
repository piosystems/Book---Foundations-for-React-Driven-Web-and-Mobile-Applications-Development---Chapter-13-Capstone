const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

const paths = {
    styles: {
      src: 'src/bulma/css/*.css',
      dest: 'src/static/css/'
    },
    //scripts: {
    //  src: 'src/scripts/**/*.js',
    //  dest: 'assets/scripts/'
   // }
  };

/*
gulp.task('minify-css', () => {
    return gulp.src(paths.styles.src)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            basename: 'book-example',
            suffix: '.min'
          }))
        .pipe(gulp.dest(paths.styles.dest));
});
*/
const minifyCSS = () => {
  return gulp.src(paths.styles.src)
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({
          //basename: 'new-base-name-if-desired',//use a new destination base name if different from the source filename.
          suffix: '.min' //add the suffix to show that it is minimized
        }))
      .pipe(gulp.dest(paths.styles.dest));
};

exports.default = minifyCSS