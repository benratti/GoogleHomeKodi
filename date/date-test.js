const DateHelper = require('./date.js');

QUnit.test( "getEndDate should add 50 minutes when time has 10 minutes and total time has 1 hours", function( assert ) {
    // Arrange
    let time = { seconds: 0, minutes: 10, hours: 0};
    let totaltime = { hours: 1, minutes: 0, seconds: 0};

    let expectedEndDate = new Date();

    expectedEndDate.setMinutes(expectedEndDate.getMinutes() + 50);

    // Act
    let endDate = DateHelper.getEndDate(time, totaltime);

    // Assert
    assert.ok(endDate.getTime() - expectedEndDate.getTime() < 10, "difference between endDate and expectedEndDate should be minus 10 ms");



});


