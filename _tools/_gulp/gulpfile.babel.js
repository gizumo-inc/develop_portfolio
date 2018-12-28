import gulp from 'gulp';
import path from 'path';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import rimraf from 'rimraf';
import browserSync from 'browser-sync';

const bs = browserSync.create();
const config = {
  develop: {
    htmlSrc: path.resolve(__dirname, '../../_develop/html/**/*.html'),
    cssSrc: path.resolve(__dirname, '../../_develop/css/**/*.scss'),
    assetsSrc: path.resolve(__dirname, '../../_develop/assets/**/**.*'),
    destPreviewHtml: path.resolve(__dirname, '../../_preview/'),
    destPreviewAssets: path.resolve(__dirname, '../../_preview/assets/'),
    destPreviewCss: path.resolve(__dirname, '../../_preview/assets/css/'),
    cleanPreview: path.resolve(__dirname, '../../_preview'),
  },
};

gulp.task('compile:scss', callback => {
  return gulp.src(config.develop.cssSrc)
              .pipe(plumber())
              .pipe(sassGlob())
              .pipe(autoprefixer())
              .pipe(sass())
              .pipe(cleanCss())
              .pipe(gulp.dest(config.develop.destPreviewCss));
              callback();
});

gulp.task('copy:html', callback => {
  return gulp.src(config.develop.htmlSrc)
              .pipe(gulp.dest(config.develop.destPreviewHtml));
              callback();
});

gulp.task('copy:assets', callback => {
  return gulp.src(config.develop.assetsSrc)
              .pipe(gulp.dest(config.develop.destPreviewAssets))
              callback();
});

gulp.task('clean:preview', callback => {
  rimraf(config.develop.cleanPreview, () => {
    rimraf.sync(config.develop.cleanPreview);
  });
  callback();
});

gulp.task('start:server', callback => {
  bs.init({
    server: {
      baseDir: config.develop.destPreviewHtml,
      index: 'index.html',
    },
    port: 8000,
  });
  callback();
});

gulp.task('watch:html', callback => {
  gulp.watch(config.develop.htmlSrc, gulp.parallel('copy:html'));
});

gulp.task('watch:assets', callback => {
  gulp.watch(config.develop.assetsSrc, gulp.parallel('copy:assets'));
  callback();
});

gulp.task('watch:scss', callback => {
  gulp.watch(config.develop.cssSrc, gulp.parallel('compile:scss'));
  callback();
});

gulp.task('watch', gulp.parallel('watch:html', 'watch:assets', 'watch:scss'));

gulp.task('default', gulp.series('copy:assets', 'copy:html', 'compile:scss'));