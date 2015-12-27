# Introduction
This is a mocha reporter project to integrate mocha unit tests to [sonar Generic Test coverage unit tests execution results](http://docs.sonarqube.org/display/PLUG/Generic+Test+Coverage#GenericTestCoverage-UnitTestsExecutionResultsReportFormat)

This reporter is only for unit test sucess/failures verification, to unit test line coverage take a look on [istanul reporter](https://www.npmjs.com/package/grunt-istanbul)

# Installation

	npm install mocha-json-report --save-dev

On pure mocha 

	mocha --reporter mocha-sonar-generic-test-coverage testFolder

On **mocha-test** for use with grunt

	mochaTest: {
		coverage: {
			options: {
				reporter: 'mocha-sonar-generic-test-coverage',
				quiet: true,
				captureFile: 'unit-tests.xml'
			},
			src: [
				'test.js'
			]
		}
	}

# Output example 
	<unitTest version="1">
		<file path="src/main/java/com/example/MyClass.java">
			<testCase name="test1" duration="500"/>
			<testCase name="test2" duration="600"/>
			<testCase name="test3" duration="600">
				<failure message="sort message">long stacktrace</failure>
			</testCase>
			<testCase name="test4" duration="600">
				<error message="sort message">long stacktrace</error>
			</testCase>
			<testCase name="test5" duration="600">
				<skipped message="sort message">long stacktrace</skipped>
			</testCase>
		</file>
	</unitTest>

Sonar preview

![](http://i.imgur.com/mlxAPI1.jpg)
![](http://i.imgur.com/n9eCbt7.jpg)
![](http://i.imgur.com/Bfw0amn.jpg)