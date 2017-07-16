# Introduction
This is a mocha reporter project to integrate mocha unit tests to [sonar Generic Test coverage unit tests execution results](http://docs.sonarqube.org/display/PLUG/Generic+Test+Coverage#GenericTestCoverage-UnitTestsExecutionResultsReportFormat)

This reporter is only for unit test sucess/failures verification, to unit test line coverage take a look on [istanbul reporter](https://www.npmjs.com/package/grunt-istanbul)

# Installation

	npm install mocha-sonar-generic-test-coverage --save-dev

On pure mocha 

	mocha --reporter mocha-sonar-generic-test-coverage testFolder

On **mocha-test** for use with grunt

```javascript
mochaTest: {
	coverage: {
		options: {
			reporter: 'mocha-sonar-generic-test-coverage',
			quiet: false,
			captureFile: null, // default mocha test capture file variable
			reporterOptions: {
				outputFile: null, // relative path file to capture instead append to captureFile (this file will not get prints at stdout) 
				useFileFullPath: false // generate report for the files using fullpath
			}
		}
		},
		src: [
			'test.js'
		]
	}
}
```

# Testing

	$ npm install && npm test

# Report demo sample

	$ npm install && \
	cd demo && \
	npm install && \
	npm start

	Running "mochaTest:test" (mochaTest) task
	Warning: Task "mochaTest:test" failed. Used --force, continuing.
	Done, but with warnings.

There is one test with error intencionally for metrics at sonar

Running sonarscanner

	$ docker run -p9000:9000 --name sonarqube -v $PWD:/app defreitas/sonarqube:6.3.1-alpine

Reporting to sonarqube

	$ docker exec -it sonarqube sh -c 'cd /app && sonar-scanner'

Then [open your browser](http://127.0.0.1:9000/component_measures/metric/tests/list?id=mocha-sonar-generic-test-coverage-demo) and see the test report results 

# Output example 

```xml
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
```

Sonar preview

![](http://i.imgur.com/mlxAPI1.jpg)
![](http://i.imgur.com/n9eCbt7.jpg)
![](http://i.imgur.com/Bfw0amn.jpg)


# Release Notes
0.0.6 backing mstc support
0.0.5 SonarQube > 6.2 support - [See reference](See: https://docs.sonarqube.org/display/PLUG/Generic+Test+Coverage)
0.0.4 `mstc` variable was migrated to `reporterOptions`, anyway `mstc` it's supported yet