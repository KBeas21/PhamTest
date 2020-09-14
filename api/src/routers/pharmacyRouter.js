const express = require("express");
const Pharmacy = require("../models/pharmacy");
const router = new express.Router();

// addes data to DB
// router.post("/pharmacy", async (req, res) => {
//   const pham = new Pharmacy({...req.body});
//   try {
//     await pham.save();
//     res.status(201).send(pham);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//   }
// });

/**
 * used to prevent COR errors
 */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get("/pharmacy", async (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  if (!latitude && !longitude) {
    res.status(400).send();
  }
  try {
    const pharmacy = await findClosestPharmacy(latitude, longitude);
    !pharmacy ? res.status(404).send() : res.send(pharmacy);

    // const pharmacy = await flatEarthApproach(latitude, longitude);
    // !pharmacy ? res.status(404).send() : res.send(pharmacy);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

/**
 * Finds the closest pharmacy using haversine's formula (direct line) approach.
 * NOTE: Will return an empty array if no pharmacies are found
 *
 * @see https://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/
 * @param {Number} givenLatitude - latitude you wish to calculate distance from.
 * @param {Number} givenLongitude - longitude you wish to calculate distance from.
 * 
 * @returns {Object} 
 */
async function findClosestPharmacy(givenLatitude, givenLongitude) {
    const pharmacies = await Pharmacy.find({}); // returns an array of objects
    const EARTHS_RADIUS_MILES = 3959; // constant for converting to miles, 6371 for kilometers
    let distanceArray = [];
    let radCurrentLat, radCurrentLong, deltaLong, radDeltaLong, deltaLat, radDeltaLat, distance;

    for (let pharmacy of pharmacies) {
      const { latitude, longitude, _id } = pharmacy;

      if (givenLatitude == latitude && givenLongitude == longitude) {
        // at the location already
        distanceArray.push({ _id, distance: 0 });
        break;
      } else {
        radCurrentLat = toRadians(givenLatitude);
        radCurrentLong = toRadians(givenLongitude);
        deltaLong = longitude - givenLongitude;
        radDeltaLong = toRadians(deltaLong);
        deltaLat = latitude - givenLatitude;
        radDeltaLat = toRadians(deltaLat);
        
        const a = Math.pow(Math.sin(radDeltaLat / 2), 2) + Math.cos(radCurrentLat)
          * Math.cos(latitude * Math.PI / 180) * Math.pow(Math.sin(radDeltaLong / 2), 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = EARTHS_RADIUS_MILES * c;

        distanceArray.push({ _id, distance });
      }
    }

    distanceArray.sort((firstE, secondE) => {
      return firstE.distance - secondE.distance;
    });

    const pharmacy = pharmacies.find((pharmacy) => pharmacy._id === distanceArray[0]._id);

    return { pharmacy, distance: distanceArray[0].distance }
    // pharmacy.distance = distanceArray[0].distance; // see partner code in model for more information
    // return { pharmacy }
}

/**
 * Converts a number to radians
 *
 * @param {Number} num  - you want to convert to radians
 * @returns the provided number in radians.
 */
function toRadians(num) {
  return (num * Math.PI)/180;
}

/**
 * A naive approach not calculating for the curvature of the earth...flat earther approach?
 *
 * @param {Number} lat - latitude you wish to calculate distance from.
 * @param {Number} long - longitude you wish to calculate distance from.
 */
async function flatEarthApproach(lat, long) {
  const pharmacies = await Pharmacy.find({});

  const tuples = [];
  pharmacies.forEach((pharmacy) => {
    const { _id, latitude, longitude } = pharmacy;
    const dist = Math.sqrt(Math.pow((lat - latitude), 2) + Math.pow((long - longitude), 2));
    tuples.push({ _id, dist });
  });
  tuples.sort((a, b) => a.dist - b.dist);

  const pharmacy = pharmacies.find((pharmacy) => tuples[0]._id === pharmacy._id);
  return { ...pharmacy, distance: tuples[0].dist}
}

module.exports = router;