var fs = require('fs'),
		util = require('util');

module.exports = function (runner) {

	var stack = {};
	runner.on('test end', function(test){

		var file = test.file.substr(test.file.indexOf(process.cwd()) + process.cwd().length + 1);
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
	});
};
function append(str) {
	if(GLOBAL['mstc']){
		GLOBAL['mstc'](str);
		GLOBAL['mstc']('\n');
	}else{
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