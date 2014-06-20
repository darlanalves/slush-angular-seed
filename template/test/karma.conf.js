module.exports = function(config) {

	config.set({
		basePath: '..',
		colors: true,

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress', 'coverage'],

		// level of logging
		// possible values: config.LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		//logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false,

		proxies: {
			'/': 'http://localhost:8000/'
		},

		files: [
			'public/lib/angular.js',
			'public/lib/angular-mocks.js',
			'public/lib/angular-ui-router.js',
			'src/module.js',
			'src/**/*.js',
			'test/unit/**/*.spec.js',
			'test/unit/run.js'
			// 'public/mocks.js'
		],

		exclude: [
			'src/routes.js'
		],

		urlRoot: '/__karma__/',

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		// frameworks to use
		browsers: ['PhantomJS'],

		frameworks: ['jasmine'],

		// web server port
		port: 9800,

		// NOTE: the "**/" portion is essential to get the coverage results
		preprocessors: {
			'**/src/**/*.js': 'coverage'
		},

		coverageReporter: {
			type: 'html',
			dir: 'test/coverage/'
		}
	});
};