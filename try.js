const request = require('request');
const url ='https://api6.ipify.org?format=json'

  // use request to fetch IP address from JSON API
  request(`http://api.open-notify.org/iss-pass.json?lat=49.26200&lon=-123.09230`, (error, response, body) => {
    //console.log("error:",error);
     //console.log("response:", response);
     //const data = JSON.parse(body);
     console.log("body:",body);
  });
