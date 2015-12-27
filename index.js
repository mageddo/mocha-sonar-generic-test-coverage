var fs = require('fs'),
		util = require('util');

module.exports = function (runner) {

	var stack = {};
	var title;
	runner.on('test end', function(test){
		var file = test.file.substr(test.file.indexOf(process.cwd()) + process.cwd().length + 1);
		stackF = stack[file];
		if(!stackF){
			stackF = stack[file] = [];
		}
		var mtest = {
			title: test.title,
			titleId: title + ': ' + test.title,
			suite: title,
			stack: test.stack,
			message: test.message,
			file: file,
			duration: test.duration,
			state: test.state != undefined ? test.state : 'skipped'
		};
		stackF.push(mtest);
	});
	
	runner.on('suite', function(test){
		title = test.title;
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
				// console.log('>', test.titleId , test);
				if(test.state === 'passed'){
					append(util.format('		<testCase name="%s" duration="%d"/>', espape(test.titleId), test.duration));
				}else{
					append(util.format('		<testCase name="%s" duration="%d">', espape(test.titleId), test.duration != undefined ? test.duration : 0));
					if(test.state === 'failed'){
						append(util.format('			<failure message="%s"><![CDATA[%s]]></failure>', escape(test.err.message), test.err.stack));
					}else{
						append(util.format('			<skipped message="%s"><![CDATA[%s]]></skipped>', espape(test.title), ''));
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
	process.stdout.write(str);
	process.stdout.write('\n');
};
function espape(str){
	return str.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;');
}