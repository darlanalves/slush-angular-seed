'use strict';

var gulp = require('gulp'),
	util = require('gulp-util'),
	install = require('gulp-install'),
	conflict = require('gulp-conflict'),
	template = require('gulp-template'),
	rename = require('gulp-rename'),
	multipipe = require('multipipe'),
	async = require('async'),
	_ = require('underscore.string'),
	inquirer = require('inquirer'),
	fs = require('fs'),
	spawn = require('child_process').spawn,
	path = require('path');

gulp.task('default', function(exit) {
	var basename = path.basename(path.resolve('.'));

	function run(oldAnswers) {
		oldAnswers = oldAnswers || {};

		var configPrompts = [{
			name: 'name',
			message: 'Project name:',
			default: oldAnswers.name || basename
		}, {
			name: 'description',
			message: 'Description:',
			default: oldAnswers.description || undefined
		}, {
			name: 'version',
			message: 'Version:',
			default: oldAnswers.version || '0.0.0'
		}, {
			name: 'author',
			message: 'Author:',
			default: oldAnswers.author || undefined
		}, {
			name: 'repository',
			message: 'Git repository:',
			default: oldAnswers.repository || undefined
		}];

		getAnswers(configPrompts, function(err, config) {
			if (err) {
				return exit();
			}

			var json = makePackageJson(config),
				reviewJson = {
					name: json.name,
					description: json.description,
					version: json.version,
					author: json.author,
					repository: json.repository
				};

			console.log(JSON.stringify(reviewJson, null, '\t'));

			inquirer.prompt([{
				name: 'confirm',
				message: 'Is this OK?',
				type: 'confirm',
				default: true
			}], function(answer) {
				if (!answer.confirm) {
					return run(config);
				}

				async.series([

					function(callback) {
						util.log('Making package.json');
						savePackageJson(json, callback);
					},
					function(callback) {
						util.log('Copying files');
						copyTemplateFiles(config, callback);
					},

					function(callback) {
						util.log('Installing modules');
						runNpm(callback);
					},
					function(callback) {
						util.log('Building assets');
						makeAssets(callback);
					}
				], function(err) {
					if (err) util.log(util.colors.red('[error] ') + err);

					exit();
				});
			});
		});
	}

	function getAnswers(prompts, callback) {
		if (fs.existsSync('./package.json')) {
			var projectJson = fs.readFileSync('./package.json');

			try {
				projectJson = JSON.parse(projectJson);
				prompts.forEach(function(o) {
					var name = o.name,
						value = projectJson[o.name];

					if (!(name in projectJson) || value === undefined) return;
					console.log(name, value);

					// special case: author is object
					if (name === 'author' && typeof value === 'object') {
						value = value.name + ' <' + value.email + '>';
					}

					o.default = value;
				});
			} catch (e) {
				console.log(e);
			}
		}

		inquirer.prompt(prompts,
			function(answers) {
				if (!answers.name) {
					return callback(true);
				}

				answers.nameSlug = _.slugify(answers.name);
				callback(null, answers);
			}
		);
	}

	function savePackageJson(packageJson, callback) {
		fs.writeFile('./package.json', JSON.stringify(packageJson, null, '\t'), function(err) {
			callback(err, true);
		});
	}

	function copyTemplateFiles(answers, callback) {
		var pipe = multipipe(
			gulp.src(__dirname + '/template/**'),
			template(answers),
			rename(function(file) {
				if (file.basename[0] === '_') {
					file.basename = '.' + file.basename.slice(1);
				}
			}),
			conflict('./'),
			gulp.dest('./')
		);

		pipe.on('end', function() {
			util.log('Files copied');
			callback(null, true);
		});

		pipe.on('data', function(data) {
			return data;
		});

		pipe.on('error', function(err) {
			callback(err, null);
		});
	}

	function runNpm(callback) {
		var pipe = multipipe(gulp.src('./package.json'), install());

		pipe.on('end', function() {
			util.log('Modules installed');
			callback(null, true);
		});

		pipe.on('data', function(data) {
			return data;
		});

		pipe.on('error', function(err) {
			callback(err, null);
		});
	}

	function makePackageJson(answers) {
		var author,
			packageJson = {
				name: answers.nameSlug,
				description: answers.description,
				version: answers.version,

				dependencies: {
					'express': '^4.4.3'
				},

				devDependencies: {
					'gulp': '~3.8.0',
					'gulp-concat': '~2.2.0',
					'gulp-sass': '~0.7.2',
					'gulp-templatecache': '~0.0.2',
					'gulp-uglify': '~0.3.0',
					'gulp-util': '^2.2.17',
					'gulp-rename': '^1.2.0',
					'gulp-wrap': '^0.3.0',
					'multipipe': '^0.1.1',
					'karma': '~0.12.16',
					'karma-coverage': '^0.2.4',
					'karma-jasmine': '^0.1.5',
					'karma-phantomjs-launcher': '^0.1.4'
				},

				scripts: {
					'test': './node_modules/karma/bin/karma start test/karma.conf.js --single-run',
					'start': 'server.js'
				}
			};

		if (answers.author) {
			if (/</.test(answers.author)) {
				author = answers.author.split('<');
				packageJson.author = {
					name: author[0],
					email: author[1].replace('>', '')
				};
			} else {
				packageJson.author = answers.author;
			}
		}

		if (answers.repository) {
			packageJson.repository = {
				type: 'git',
				url: answers.repository
			};
		}

		return packageJson;
	}

	function makeAssets(callback) {
		var build = spawn('gulp', ['build']);

		build.stderr.on('data', function(data) {
			console.log('' + data);
		});

		build.stdout.on('data', function(data) {
			console.log('' + data);
		});

		build.on('close', function(code) {
			callback(code !== 0 ? code : null, true);
		});
	}

	run();
});