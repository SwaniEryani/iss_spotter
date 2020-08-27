const { nextISSTimesForMyLocation} = require('./iss_promised');
const request = require('request-promise-native');


const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};
//printPassTimes(nextISSTimesForMyLocation());

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })