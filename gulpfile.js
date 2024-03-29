import gulp from 'gulp';
import bump from 'gulp-bump';
import git from 'gulp-git';
import tagVersion from 'gulp-tag-version';
import wait from 'gulp-wait';

import path from 'path';

gulp.task('bump', () => {
	return gulp.src(path.join(process.cwd(), 'package.json'))
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

gulp.task('git:add', () => {
	return gulp.src(process.cwd())
		.pipe(git.add({ args: '--all -v' }));
});
gulp.task('git:commit', () => {
	return gulp.src(process.cwd())
		.pipe(git.commit(process.argv[4] || 'Bump version'));
});
gulp.task('git:tag', () => {
	return gulp.src(path.join(process.cwd(), 'package.json'))
		.pipe(tagVersion())
		.pipe(wait(500));
});
gulp.task('git:push', (callback) => {
	git.push('origin', 'master', { args: '-v --tags' }, () => {
		callback();
	});
});

gulp.task('git', gulp.series('git:add', 'git:commit', 'git:tag', 'git:push'));

gulp.task('release', gulp.series('bump', 'git'));