import express from 'express';
import config from '../config'
import curl from 'curlrequest';
import rest from 'rest';

let router = express.Router();

router.post('/', (req, res) => {
      console.log("in googlePlaceSearch route: ", req.body.searchStr)
      rest('http://freegeoip.net/json/').then(function(response) {
          var parsedData = JSON.parse(response.entity)
          var pos = {
              lat: parsedData.latitude,
              lng: parsedData.longitude
          };

          var encodeRes = encodeURIComponent(req.body.searchStr)

          var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + encodeRes + "&location=" + pos.lat +"," + pos.lng + "&radius=20&key=" + config.googlePlaceApiKey
          // https://maps.googleapis.com/maps/api/place/textsearch/json?query=coles&location=-37.8103,144.9544&radius=20&key=AIzaSyBYNqtR2RJBsq44d31RZe2Znch8_SX4RXM
          // https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=<>&key=AIzaSyBYNqtR2RJBsq44d31RZe2Znch8_SX4RXM
          console.log("url: ", url)
          var options = { url: url};
          var errors = {}
          curl.request(options, function (err, res1) {
              if (err) {
                  errors.searchBar = "google api error, We could not find " + req.body.searchStr
                  res.status(400).json(errors);
              } else {
                  var element = JSON.parse(res1)
                  if (!element.results[0]) {
                      console.log("not in google search")
                      errors.searchBar = "We could not find " + req.body.searchStr
                      res.status(400).json(errors);
                  } else {
                      var elem = element.results[0];
                      // console.log("elem: ", elem.photos[0])
                      var lat = element.results[0].geometry.location.lat;
                      var lng = element.results[0].geometry.location.lng;
                      var addr = elem.formatted_address;
                      var name = elem.name;
                      if (elem.photos) {
                          var photo_ref = elem.photos[0].photo_reference;
                          // var temp_url = elem.photos[0].getUrl({ 'maxWidth': 35, 'maxHeight': 35 })
                          // console.log("temp_url: ", temp_url)
                          console.log("photo_ref: ", photo_ref)
                      } else {
                          var photo_ref = null
                      }
                      var obj = {
                          lat: lat,
                          lng: lng,
                          photo: photo_ref,
                          addr: addr,
                          name: name
                      }

                      res.json({obj});

                  }

              }
          });

      });
});


export default router;
