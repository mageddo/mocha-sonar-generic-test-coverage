var assert = require("assert"),
		report = require("../index.js"),
		util = require("util"),
		fs = require("fs");

var reportFile = "out/report.xml";

describe('Mocha Sonar Generic Report', function(){

	describe('Report', function(){

        it('Report To File Success with reporterOptions prefix', function(){
            testReportToFileSuccess('reporterOptions')
        });

        it('Report To File Success with mstc prefix', function(){
            testReportToFileSuccess('mstc')
        });

        it('Report To File Success And Error with reporterOptions prefix', function(){
            testReportToFileSuccessAndError('reporterOptions')
        });

        it('Report To File Success And Error with mstc prefix', function(){
            testReportToFileSuccessAndError('mstc')
        });

        it('Report To File With FullPath with reporterOptions prefix', function(){
            testReportToFileWithFullPath('reporterOptions')
        });

        it('Report To File With FullPath with mstc prefix', function(){
            testReportToFileWithFullPath('mstc')
        });

		it('Report To Stdout', function(){
            testReportToStdout();
		});

	});

});

function config(prefix, config) {
    var ret = {};
    ret[prefix] = config
    return ret;
}

function testReportToStdout() {
    resetTest();
    var actualContent = "";
    var unhook = hookStdout(function(str, encoding, fd){
        actualContent += str;
    });
    var runner = new Runner();
    report(runner, {});
    runner.run([
        new Test('Success Test', null, null, 1, 'success', process.cwd() + '/tmp/test.js')
    ]);

    var expected = `<unitTest version="1">
	<file path="tmp/test.js">
		<testCase name="Success Test" duration="1">
		</testCase>
	</file>
</unitTest>
`;
    unhook();
    assertXML(actualContent, expected);
}

function testReportToFileSuccess(prefix) {
    resetTest();

    var runner = new Runner();
    report(runner, config(prefix, {
        outputFile: reportFile
    }));
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
    assertXML(actualContent, expected);
}

function testReportToFileSuccessAndError(prefix) {
    resetTest();

    var runner = new Runner();
    report(runner, config(prefix, {
        outputFile: reportFile,
        useFileFullPath: false
    }));
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
    assertXML(actualContent, expected);
}

function testReportToFileWithFullPath(prefix) {
    resetTest();

    var runner = new Runner();
    report(runner, config(prefix, {
        outputFile: reportFile,
        useFileFullPath: true
    }));
    runner.run([
        new Test('Success Test', null, null, 1, 'success', '/tmp/test.js')
    ]);

    var actualContent = getFileContent(reportFile);
    var expected = `<unitTest version="1">
	<file path="/tmp/test.js">
		<testCase name="Success Test" duration="1">
		</testCase>
	</file>
</unitTest>
`;
    assertXML(actualContent, expected);
}

function replaceAll(string, search, replacement) {
    return string.split(search).join(replacement);
};

function assertXML(actual, expected) {
	var actual = replaceAll(actual, '\r\n', '\n');
    var expected = replaceAll(expected, '\r\n', '\n');
	assert.deepEqual(actual, expected);
}


function getFileContent(reportFile){
	try{
		return fs.readFileSync(reportFile, 'utf8')
	} catch(e){
		return "";
	}
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

function Runner (){

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
function resetTest(){
	try{
		delete process.env['mocha_sonar_generic_test_coverage_outputfile'];
		fs.unlinkSync(reportFile);
	}catch(e){}
}

function hookStdout(callback) {

		var oldWrite = process.stdout.write
		process.stdout.write = function(string, encoding, fd) {
				callback(string, encoding, fd)
		}
		
		return function() {
			process.stdout.write = oldWrite
		}
}