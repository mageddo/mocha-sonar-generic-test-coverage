var fs = require('fs'),
		util = require('util');

module.exports = function (runner) {

	var stack = {};
	var title;
	runner.on('test end', function(test, err){
		stackF = stack[test.file];
		if(!stackF){
			stackF = stack[test.file] = [];
		}
		stackF.push(test);
	});
	
	runner.on('suite', function(test){
		title = test.title;
	});

	runner.on('test end', function(test, err){
		test.suite = test.title;
		test.titleId = title + ': ' + test.title;
	});
	runner.on('fail', function(test, err){
		test.err = err;
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
				// delete test.err;
				// console.log(JSON.stringify(test, null, '  '));
				// console.log(test);
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