var fs = require('fs'),
	util = require('util'),
	path = require('path'),
	mkdirpSync = require('mkdirp').sync,
	os = require('os');


module.exports = function (runner, options) {

	var logFd, 
	stack = {};

	var outputfile = getPrefixedProp(options, 'outputFile');
	if (outputfile) {
		mkdirpSync(path.dirname(outputfile));
		logFd = fs.openSync(outputfile, 'w');
	}

	runner.on('test end', function(test){

		var file = getPrefixedProp(options, 'useFileFullPath') ? test.file : test.file.substr(test.file.indexOf(process.cwd()) + process.cwd().length + 1);
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
		append(logFd, '<unitTest version="1">');
		Object.keys(stack).forEach(function(file){
			append(logFd, util.format('	<file path="%s">', file));
			stack[file].forEach(function(test){
				switch(test.state){
					case 'passed':
						append(logFd, util.format(
							'		<testCase name="%s" duration="%d"/>',
							escape(test.titleId), test.duration
						));
						break;
					default :
						append(logFd, util.format(
							'		<testCase name="%s" duration="%d">',
							escape(test.titleId), test.duration != undefined ? test.duration : 1
						));
						switch(test.state){
							case 'failed':
								append(logFd, util.format(
									'			<failure message="%s"><![CDATA[%s]]></failure>',
									escape(test.message), test.stack
								));
								break;
							case 'skipped':	
								append(logFd, util.format(
									'			<skipped message="%s"></skipped>', escape(test.title)
								));
								break;
						}
						append(logFd, '		</testCase>');
				}
			});
			append(logFd, '	</file>');
		});
		append(logFd, '</unitTest>');
		
		if(logFd !== undefined) {
			fs.closeSync(logFd);
		}
	});
};

function append(logFd, str) {
	if(logFd !== undefined) {
		fs.writeSync(logFd, str + os.EOL);
	} else {
		process.stdout.write(str);
		process.stdout.write('\n');
	}
}

function escape(str){
	str = str || '';
	return str.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;');
}

function getPrefixedProp(map, keys) {
	return getProp(map, 'reporterOptions.' + keys) || getProp(map, 'mstc.' + keys);
}

function getProp(map, keys){

	var props = keys.split("\.");
	for(var i=0; i < props.length; i++) {

		var prop = props[i];
		map = map[prop];
		if (!map){
			return null;
		}

	}
	return map;
}