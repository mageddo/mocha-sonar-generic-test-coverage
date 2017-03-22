# Introduction
This is a mocha reporter project to integrate mocha unit tests to [sonar Generic Test coverage unit tests execution results](http://docs.sonarqube.org/display/PLUG/Generic+Test+Coverage#GenericTestCoverage-UnitTestsExecutionResultsReportFormat)

This reporter is only for unit test sucess/failures verification, to unit test line coverage take a look on [istanbul reporter](https://www.npmjs.com/package/grunt-istanbul)

# Installation

	npm install mocha-sonar-generic-test-coverage --save-dev

On pure mocha 

	mocha --reporter mocha-sonar-generic-test-coverage testFolder

On **mocha-test** for use with grunt

	mochaTest: {
		coverage: {
			options: {
				reporter: 'mocha-sonar-generic-test-coverage',
				quiet: false
			},
			src: [
				'test.js'
			]
		}
	}

If you want to write your report in a specific file (instead of standard output by default), add the following environment variable with the path to the report file:
	env: {
    	mocha_sonar_generic_test_coverage_outputfile:'output/unit-tests.xml'
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
