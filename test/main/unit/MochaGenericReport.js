var assert = require("assert")
var report = require("../../../index.js")

describe('Mocha Sonar Generic Report', function(){

	describe('Report', function(){
		
		it('Report To Sdout', function(){
			
			var appender = "";

			GLOBAL['mstc'] = function(str){
				appender += str;
			}
			var runner = new Runner();
			report(runner);
			runner.run([
				new Test('Success Test', null, null, 1, 'success', process.cwd()+'/tmp/test.js')
			]);

			expected = `<unitTest version="1">
	<file path="tmp/test.js">
		<testCase name="Success Test" duration="1">
		</testCase>
	</file>
</unitTest>
`;
			assert.deepEqual(appender, expected);

		});
	});

});


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