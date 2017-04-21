var fs = require('fs'),
		util = require('util');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;
var os = require('os');

var logFd;

module.exports = function (runner) {
	
	var outputfile = process.env.mocha_sonar_generic_test_coverage_outputfile;

    if (outputfile) {
		mkdirpSync(path.dirname(outputfile));
		logFd = fs.openSync(outputfile, 'w');
    }

	var stack = {};
	runner.on('test end', function(test){
		var file = test.file;
		stackF = stack[file];
		if(!stackF){
			stackF = stack[file] = [];
		}
		var mtest = {
			title: test.title,
			titleId: test.fullTitle(),
			stack: test.stack,
			message: test.message,
			file: file,
			duration: test.duration,
			state: test.state != undefined ? test.state : 'skipped'
		};
		stackF.push(mtest);
	});
	
	runner.on('fail', function(test, err){
		test.stack = err.stack;
		test.message = err.message;
	});

	runner.on('end', function() {
		append('<unitTest version="1">');
		Object.keys(stack).forEach(function(file){
			append(util.format('	<file path="%s">', file));
			stack[file].forEach(function(test){
				switch(test.state){
					case 'passed':
						append(util.format(
							'		<testCase name="%s" duration="%d"/>',
							escape(test.titleId), test.duration
						));
						break;
					default :
						append(util.format(
							'		<testCase name="%s" duration="%d">',
							escape(test.titleId), test.duration != undefined ? test.duration : 1
						));
						switch(test.state){
							case 'failed':
								append(util.format(
									'			<failure message="%s"><![CDATA[%s]]></failure>',
									escape(test.message), test.stack
								));
								break;
							case 'skipped':	
								append(util.format(
									'			<skipped message="%s"></skipped>', escape(test.title)
								));
								break;
						}
						append('		</testCase>');
				}
			});
			append('	</file>');
		});
		append('</unitTest>');
		
		if(logFd !== undefined) {
			fs.closeSync(logFd);
		}
	});
};
function append(str) {
	if(logFd !== undefined) {
		fs.writeSync(logFd, str + os.EOL);
	} else {
		process.stdout.write(str);
		process.stdout.write('\n');
	}
};
function escape(str){
	str = str || '';
	return str.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;');
}