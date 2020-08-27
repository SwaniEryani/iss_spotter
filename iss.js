/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');
const url = 'https://api6.ipify.org?format=json';
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;

    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {

  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS for Coordinates: ${body}`), null);
      return;
    }

    const responses = JSON.parse(body).response;
    callback(null, responses);
  });
};
// const nextISSTimesForMyLocation = function(callback) {
//   if (error) {
//     callback("It didn't work!" , error);
//     return;
//   }

// fetchISSFlyOverTimes(fetchCoordsByIP(fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   return ip;
// })
// , (error, coords) => {
//     if (error) {
//       console.log("It didn't work!", error);
//       return;
//     }
//     return coords;
//   }), (error, passTimes) => {
//     if (error) {
//       console.log("It didn't work!" , error);
//       return;
//     }
//     return passTimes;
//   });

  
// }
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};



module.exports = { nextISSTimesForMyLocation };
