var assert = require("assert"),
		report = require("../../../index.js"),
		fs = require("fs");

var reportFile = "out/report.xml";

describe('Mocha Sonar Generic Report', function(){

	describe('Report', function(){

		it('Report To File Success', function(){

			fs.unlinkSync(reportFile);

			var runner = new Runner();
			report(runner, {
				mstc: {
					outputFile: reportFile
				}
			});
			runner.run([
				new Test('Success Test', null, null, 1, 'success', process.cwd()+'/tmp/test.js')
			]);

			var actualContent = getFileContent(reportFile);
			var expected = `<unitTest version="1">
	<file path="tmp/test.js">
		<testCase name="Success Test" duration="1">
		</testCase>
	</file>
</unitTest>
`;
			assert.deepEqual(actualContent, expected);

		});

		it('Report To File Success And Error', function(){

			fs.unlinkSync(reportFile);

			var runner = new Runner();
			report(runner, {
				mstc: {
					outputFile: reportFile
				}
			});
			runner.run([
				new Test('Success Test', null, null, 1, 'success', process.cwd()+'/tmp/test.js'),
				new Test('Success Test', "IO error", "File not found", 2, 'failed', process.cwd()+'/tmp/test.js'),
			]);

			var actualContent = getFileContent(reportFile);
			var expected = `<unitTest version="1">
	<file path="tmp/test.js">
		<testCase name="Success Test" duration="1">
		</testCase>
		<testCase name="Success Test" duration="2">
			<failure message="File not found"><![CDATA[IO error]]></failure>
		</testCase>
	</file>
</unitTest>
`;
			assert.deepEqual(actualContent, expected);

		});

	});

});


function getFileContent(reportFile){
	return fs.readFileSync(reportFile, 'utf8')
}

function Test(title, stack, message, duration, state, file){

	this.title = title;
	this.stack = stack; // when get error
	this.message = message; // when get error or skipped
	this.duration = duration;
	this.state = state; // failed, passed or undefined (skipped)
	this.file = file;

	this.fullTitle = function(){
		return this.title;
	}
}

function Runner (appender){

	this.appender = appender;

	var testTend = [];
	var end = [];
	var fail = [];

	this.on = function(action, func){
		switch(action){
			case 'test end':
				testTend.push(func);
				break;
			case 'end':
				end.push(func);
				break;
			case 'fail':
				fail.push(func);
				break;
		}
	}
	this.run = function(tests){

		tests.forEach(test => {

			testTend.forEach(v => {
				v(test)
			});

		})
		end.forEach(v => {
			v();
		})

	}
}