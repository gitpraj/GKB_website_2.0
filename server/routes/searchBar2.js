import express from 'express';
import lodash from 'lodash';
import validator from 'validator';
import config from '../config'
import curl from 'curlrequest';
import jwt from 'jsonwebtoken';
// import moment from 'moment';

var rest = require('rest')
var ElementEl = require('./../models/node.js');
var User = require('./../models/user.js');
var DescriptionSchema = require('./../models/placeDescription');
var GooglePlaces = require('./../models/googlePlaces')
var autoDescription = require('./../models/autoDescription')
//var rest = require('rest')

let router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);
    console.log("id: " + req.body.user_id);
    console.log("searchStr: " + req.body.searchStr);
    console.log("finally in searchBar route");
    console.log("fulladdr: ", req.body.fulladdr);
    console.log("DATE: ", Date());

    const query = { placeFullAddr: req.body.fulladdr}

    const button = req.body.button

    // if button was clicked, different way of dealing
    if (button) {
        console.log("go button clicked")
        //places

        var ret = {};
        ret = queryJena(req.body.searchStr, req.body.fulladdr, req.body.user_id, function(ret) {
            //console.log("ret: ", ret)

            if (ret.error == 1) {
                var errors = ret.errors
                res.status(400).json(errors);
                // so search google now
                //https://maps.googleapis.com/maps/api/place/textsearch/json?query=IGA&location=-37.8103,144.9544&radius=20&key=AIzaSyBYNqtR2RJBsq44d31RZe2Znch8_SX4RXM
                //autocomplete
                //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=hawthorn&location=-37.8103,144.9544&radius=20&key=AIzaSyBYNqtR2RJBsq44d31RZe2Znch8_SX4RXM

                console.log("not present in jena, so gooogle");
                rest('http://freegeoip.net/json/').then(function(response) {
                    var parsedData = JSON.parse(response.entity)
                    var pos = {
                        lat: parsedData.latitude,
                        lng: parsedData.longitude
                    };

                    var options = { url: url};
                    curl.request(options, function (err, res1) {

                    });

                });

            } else {
                //send jena results
                console.log("present in jena")
                var token = ret.token
                res.json({token});
            }

        });

    } else {
        console.log("clicked on google Auto suggestion");
        var ret = {};
        ret = queryJena(req.body.searchStr, req.body.fulladdr, req.body.user_id, function(ret) {
            console.log("ret: ", ret)
            if (ret.error == 1) {

              console.log("not in jena, but in google");
              var errors = ret.errors;
              // res.status(400).json(ret);
              const query = { placeFullAddr: req.body.fulladdr}
              User.findById(req.body.user_id, function (err, s_user) {
                  // data.user = s_user;
                  DescriptionSchema.find(query, '_id user_name user_id description_content like',function (err, docs) {
                      if (err) return handleError(err);
                      //console.log(docs);
                      var counter = 1
                      var descriptionArray = [];
                      //console.log(docs);
                      if(docs.length == 0){
                          res.status(400).json({errors: null,
                                                searchHistory: ret.searchHistory,
                                                descriptionArray: null,
                                                });
                      }else{
                          docs.forEach((doc) => {
                              //console.log(doc);
                              var temp = {};
                              //console.log("user_id: ", doc);
                              User.findById(doc.user_id, 'proImg', function (err, user) {
                                  temp.doc = doc;
                                  //console.log("test111111111111111111")
                                  //console.log(" user: proimg " , )
                                  //console.log("user: ***************", user);

                                  temp.proImg = user.proImg;
                                  //console.log("temp   ", temp);
                                  descriptionArray.push(temp);
                                  //console.log(temp);
                                  if (counter == docs.length){
                                      //console.log("All done")
                                      descriptionArray.sort((a,b)=>{
                                          if( a.doc.like > b.doc.like){
                                              return -1;
                                          }else if( a.doc.like < b.doc.like ){
                                              return 1;
                                          }
                                          return 0;
                                      });
                                      var errors = {
                                        errors: ret.errors,
                                        searchHistory: ret.searchHistory,
                                        descriptionArray: descriptionArray
                                      }
                                      console.log("not in jena, but in google. With descriptionArray", errors)
                                      res.status(400).json(errors);
                                  }
                                  counter+=1;
                              });
                          });
                      }
                  });
              });

            } else {
                var token = ret.token

                console.log("return from jena");

                const query = { placeFullAddr: req.body.fulladdr}
                User.findById(req.body.user_id, function (err, s_user) {
                    // data.user = s_user;
                    DescriptionSchema.find(query, '_id user_name user_id description_content like',function (err, docs) {
                        if (err) return handleError(err);
                        //console.log(docs);
                        var counter = 1
                        var descriptionArray = [];
                        //console.log(docs);
                        if(docs.length == 0){
                            // res.status(400).json({errors: null,
                            // descriptionArray: null});
                            console.log(" in jena, Without descriptionArray")
                            token.descriptionArray = null
                            res.json({token});
                        }else{
                            docs.forEach((doc) => {
                                //console.log(doc);
                                var temp = {};
                                //console.log("user_id: ", doc);
                                User.findById(doc.user_id, 'proImg', function (err, user) {
                                    temp.doc = doc;
                                    //console.log("test111111111111111111")
                                    //console.log(" user: proimg " , )
                                    //console.log("user: ***************", user);

                                    temp.proImg = user.proImg;
                                    //console.log("temp   ", temp);
                                    descriptionArray.push(temp);
                                    //console.log(temp);
                                    if (counter == docs.length){
                                        //console.log("All done")
                                        descriptionArray.sort((a,b)=>{
                                            if( a.doc.like > b.doc.like){
                                                return -1;
                                            }else if( a.doc.like < b.doc.like ){
                                                return 1;
                                            }
                                            return 0;
                                        });
                                        // var errors = {
                                        //   errors: ret.errors,
                                        //   searchHistory: ret.searchHistory,
                                        //   descriptionArray: descriptionArray
                                        // }
                                        console.log(" in jena, With descriptionArray")

                                        token.descriptionArray = descriptionArray
                                        //console.log(token);
                                        res.json({token});
                                    }
                                    counter+=1;
                                });
                            });
                        }
                    });
                });

                // res.json({token});
            }
        });
    }
    //res.redirect('/home');
});


function queryJena(searchStr, fulladdr, id, callback) {

  var temp = 'http://localhost:8800/nominatim/search?q='
  var temp2 = '&format=json&addressdetails=1'
  var encodeRes = encodeURIComponent(fulladdr)
  console.log("encodeRes: " + encodeRes)
  var url = temp + encodeRes + temp2
  // http://localhost:8888/data?query=prefix+spatial%3A+%3Chttp%3A%2F%2Fjena.apache.org%2Fspatial%23%3Eprefix+geo%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23%3Eprefix+osm%3A+%3Chttp%3A%2F%2Fwiki.openstreetmap.org%2Fwiki%2F%3Eprefix+way%3A+%3Chttp%3A%2F%2Fwww.openstreetmap.org%2Fway%2F%3Eprefix+node%3A+%3Chttp%3A%2F%2Fwww.openstreetmap.org%2Fnode%2F%3Eprefix+infobox%3A+%3Chttps%3A%2F%2Fen.wikipedia.org%2Fwiki%2FInfobox%2F%3ESELECT+DISTINCT+*+WHERE%7Bnode%3A12327041+%3Fp+%3Fo+.%7D+LIMIT+100
  console.log("url: " + url);
  var options = { url: url};
  let errors = {};
  curl.request(options, function (err, res1) {
      if (err) {
          console.log("in err curl req");
      } else {
        var element = JSON.parse(res1)
        if (!element[0]) {
            console.log("not in nominatim jena service")
            errors.searchBar = "We could not find " + fulladdr
            //res.status(400).json(errors);
            // var ret = {
            //     error:1,
            //     errors:errors
            // }
            // Then store the searchstr in searchStr in db with google type.
            if (id != null) {
                User.findOne({_id: id},function(err,data2) {
                    let errors = {};
                    var searchHistoryStore = [];
                    console.log("data2: " + data2);
                    searchHistoryStore = data2.searchHistory;
                    console.log("searchHistoryStore: ", searchHistoryStore)
                    if(err){
                        console.log(err);
                    }else if(!data2){
                        //errors.login = "Email does not exist or wrong password";
                        //res.status(400).json(errors);
                    }else{
                        var insertToSearchHistory = {
                            type: "google",
                            searchStr: fulladdr,
                            //date: new Date()
                        }
                        //Update searchHistory in user Model.
                        User.update(
                            { _id: id, searchHistory: insertToSearchHistory},
                            {$addToSet: { searchHistory: insertToSearchHistory}},
                            function(err, user) {
                                if (err) {
                                    console.log("error in searchhistory update");
                                } else {
                                    console.log("succes in updataing searchHistory11111", user);

                                    User.findOne({_id:id,'searchHistory.searchStr': fulladdr}, function(err, data) {

                                        if(err) {
                                            console.log("1111111111111 google");
                                        } else if (!data){
                                            console.log("2222222222222 google");
                                            var insertToSearchHistoryNew = {
                                                type: "google",
                                                searchStr: fulladdr,
                                                date: new Date()
                                            }
                                            User.update(
                                                { _id: id},
                                                {$addToSet: { searchHistory: insertToSearchHistoryNew}},
                                                function(err, user) {
                                                    if (err) {
                                                        console.log("in 2nd update error")
                                                    } else {
                                                        console.log("in 2nd update success");

                                                        searchHistoryStore.push(insertToSearchHistoryNew);
                                                        console.log("in searchHistoryStore adding new location: ", searchHistoryStore)
                                                        var ret = {
                                                            error:1,
                                                            errors:errors,
                                                            searchHistory:searchHistoryStore,
                                                            autoDescription: null
                                                        }
                                                        callback(ret);
                                                    }
                                                })

                                        } else {
                                            console.log("333333333333333 google")
                                            User.update(
                                                { 'searchHistory.searchStr': fulladdr},
                                                {$set: { 'searchHistory.$.date': new Date()}},
                                                function(err, user2) {
                                                    if (err) {
                                                        console.log("error date updated");
                                                    } else {
                                                        console.log("updating date",  user2);
                                                        var ret = {
                                                            error:1,
                                                            errors:errors,
                                                            searchHistory: data2.searchHistory,
                                                            autoDescription: null
                                                        }
                                                        callback(ret);
                                                    }

                                                })
                                        }
                                    })

                                }
                            });
                    }
                });
            } else {
              // no user. Guest user trying to search
              console.log("In google searchbar line 312, in else part of no user.");
              errors.searchBar = "We could not find " + searchStr

              var ret = {
                  error:1,
                  errors:errors,
                  searchHistory:null,
                  autoDescription: null
              }
              callback(ret);
            }

        } else {
            console.log("jena success");
              // var element = JSON.parse(res1)
              console.log("element ", element[0])
              //console.log("res1[0]: ",res1[0])
              var elem = element[0]
              console.log("coords lat: ", elem.lat)
              console.log("coords longt: ", elem.lon)
              console.log("osm_id: ", elem.osm_id)

              autoDescription.findOne({element: elem.osm_id}, function (err, doc) {
                  if (err) {
                     console.log("err in autoDescription findone")
                  } else {
                      console.log("no err in autodescription")
                      var autoDescription;
                      if (doc) {
                          autoDescription = doc.autoDescription;
                      } else {
                          autoDescription = null
                      }
                      if (id != null) {
                          User.findOne({_id: id},function(err,data2){
                              var searchHistoryStore = [];
                              let errors = {};
                              console.log("data2: " + data2);
                              searchHistoryStore = data2.searchHistory;
                              if(err){
                                  console.log(err);
                              }else if(!data2){
                                  //errors.login = "Email does not exist or wrong password";
                                  //res.status(400).json(errors);
                              }else{
                                  var coords2 = {
                                      lat: elem.lat,
                                      longt: elem.lon
                                  }
                                  console.log("coords2: ", coords2);


                                  var insertToSearchHistory = {
                                      type: "jena",
                                      element: elem.osm_id,
                                      searchStr: fulladdr,
                                      //date: new Date()
                                  }
                                  //Update searchHistory in user Model.
                                  User.update(
                                      { _id: id, searchHistory: insertToSearchHistory},
                                      {$addToSet: { searchHistory: insertToSearchHistory}},
                                      function(err, user) {
                                          if (err) {
                                              console.log("error in searchhistory update");
                                          } else {
                                              console.log("succes in updataing searchHistory11111", user);



                                              User.findOne({_id:id,'searchHistory.searchStr': fulladdr}, function(err, data) {

                                                  if(err) {
                                                      console.log("1111111111111");
                                                  } else if (!data){
                                                      console.log("2222222222222");
                                                      var insertToSearchHistoryNew = {
                                                          type: "jena",
                                                          element: elem.osm_id,
                                                          searchStr: fulladdr,
                                                          date: new Date()
                                                      }
                                                      User.update(
                                                          { _id: id},
                                                          {$addToSet: { searchHistory: insertToSearchHistoryNew}},
                                                          function(err, user) {
                                                              if (err) {
                                                                  console.log("in 2nd update error")
                                                              } else {
                                                                searchHistoryStore.push(insertToSearchHistoryNew);
                                                                console.log("in searchHistoryStore adding new location: ", searchHistoryStore)

                                                                  console.log("in 2nd update success");
                                                                  const token = {
                                                                      email: data2.email,
                                                                      userName: data2.userName,
                                                                      accountType: data2.accountType,
                                                                      _id: data2._id,
                                                                      proImg: data2.proImg,
                                                                      coords: coords2,
                                                                      placeFullAddr: fulladdr,
                                                                      placePhoto: "",
                                                                      searchHistory: searchHistoryStore,
                                                                      autoDescription: autoDescription
                                                                      // showSearchResult: true
                                                                  }
                                                                  console.log("search bar sending token ");
                                                                  //res.json({token});
                                                                  var ret = {
                                                                      error:0,
                                                                      token: token
                                                                  }
                                                                  callback(ret);
                                                              }
                                                          })

                                                  } else {
                                                      console.log("333333333333333")
                                                      User.update(
                                                          { 'searchHistory.searchStr': fulladdr},
                                                          {$set: { 'searchHistory.$.date': new Date()}},
                                                          function(err, user2) {
                                                              if (err) {
                                                                  console.log("error date updated");
                                                              } else {
                                                                  console.log("updating date",  user2);
                                                                  const token = {
                                                                      email: data2.email,
                                                                      userName: data2.userName,
                                                                      accountType: data2.accountType,
                                                                      _id: data2._id,
                                                                      proImg: data2.proImg,
                                                                      coords: coords2,
                                                                      placeFullAddr: fulladdr,
                                                                      placePhoto: "",
                                                                      searchHistory: data2.searchHistory,
                                                                      autoDescription: autoDescription
                                                                      // showSearchResult: true
                                                                  }
                                                                  console.log("search bar sending token ");
                                                                  //res.json({token});
                                                                  var ret = {
                                                                      error:0,
                                                                      token: token
                                                                  }
                                                                  callback(ret);
                                                              }

                                                          })
                                                  }
                                              })

                                          }
                                      });
                              }
                          });

                          //});
                      } else {
                          var coords2 = {
                              lat: elem.lat,
                              longt: elem.lon
                          }
                          console.log("coords2: ", coords2);
                          const token = {
                              email: null,
                              userName: null,
                              accountType: null,
                              _id: null,
                              proImg: null,
                              coords: coords2,
                              placeFullAddr: fulladdr,
                              placePhoto: "",
                              searchHistory: null,
                              autoDescription: autoDescription
                              // showSearchResult: true
                          // }, 'secretkeyforjsonwebtoken');
                          }
                          console.log("search bar sending token2 ");
                          //res.json({token});
                          var ret = {
                              error:0,
                              token: token
                          }
                          callback(ret);
                      }
                  }
              });

        }
      }
  });
}



// handle search_bar location search
// test version
router.get('/testgo', (req, res) => {
    //console.log('msg from testgo:');
    //console.log(req.query.location);
    const resultlist = loadResultList(req.query.location);
    console.log(resultlist);
    //const token = jwt.sign(resultlist, 'secretkeyforjsonwebtoken');
    //res.json(resultlist);
    //res.json({users: 'users'});
    //res.send('hello');
    //res.json(resultlist);
    res.json(resultlist);

    // console.log("TestGO:" + resultlist);
    // console.log("TestGO:" + resultlist.location);
    // console.log("TestGO:" + resultlist.resultArray);
});

router.post('/addDescription', (req, res) => {

    // Add this place to googlePlaces in db only if they type is google
    if (req.body.type == "google") {
        console.log("in addDescription google places add");

        var query = {
          addr: req.body.placeFullAddr,
        }

        var place = {
          addr: req.body.placeFullAddr,
          image: req.body.image,
          coords: req.body.coords,
          // date: Date(),
        }

        GooglePlaces.find(query).count(function(err, count){
            let errors = {}
            console.log("In addFavorites Number of docs: ", count );
            if(count === 0){
                GooglePlaces.create(place,function(err,dataGoogle) {
                    console.log("Writing to db");
                    if(err){
                        console.log(err.statusCode);
                    }else if(!dataGoogle){
                        console.log(res.statusCode);
                        console.log("Error saving");
                    }else{
                        console.log(res.statusCode);
                        console.log("Registered");
                    }

                });
            }else{
                console.log("place already exists in Favorites db");
                // errors.signup = "place already exists in Favorites db";
                // res.status(400).json(errors);
            }
        });


    }

    var description = req.body
    console.log("descriptionis gonna be stored.: ", description)
    // description.date = new Date().Format("yyyy-MM-dd HH:mm:ss");
    description.like = 0;
    description.date = Date();
    // console.log(description);
    // console.log(description);


    DescriptionSchema.create(description,function(err,data){
        console.log("Writing to db");
        console.log(description);
        if(err){
            console.log(err.statusCode);
            console.log(err);
            console.log("get error");
        }else if(!data){
            console.log(res.statusCode);
            console.log("Error saving");
        }else{
            console.log(res.statusCode);
            console.log("Description added!!!!");
            const query = { placeFullAddr: description.placeFullAddr};
            //console.log(query);

            // DescriptionSchema.find(query, 'user_email placeFullAddr like', function (err, place) {
            //     if (err) return handleError(err);
            //     console.log('%s %s %s.', place.user_email, place.placeFullAddr, place.like) // Space Ghost is a talk show host.
            // });
            DescriptionSchema.find(query, '_id user_name user_id description_content like',function (err, docs) {
                if (err) console.log(err);
                var counter = 1
                var descriptionArray = [];
                docs.forEach((doc) => {
                    //console.log(doc);
                    var temp = {};
                    User.findById(doc.user_id, 'proImg', function (err, user) {
                        temp.doc = doc;
                        console.log("user: ***************", user);
                        if(user.proImg == null){
                            temp.proImg = null
                        }else{
                            temp.proImg = user.proImg;
                        }
                        descriptionArray.push(temp);
                        //console.log(temp);
                        if (counter == docs.length){
                            //console.log("All done")
                            //console.log(descriptionArray);
                            descriptionArray.sort((a,b)=>{
                                if( a.doc.like > b.doc.like){
                                    return -1;
                                }else if( a.doc.like < b.doc.like ){
                                    return 1;
                                }
                                return 0;
                            });
                            res.status(200).json(descriptionArray);
                        }
                        counter+=1;
                    });
                });
            });

        }
    })

});

router.post('/addLike', (req, res) => {
    const {des_id} = req.body;
    const {user_id} = req.body;
    // check if the user already liked this one
    var liked = false;
    DescriptionSchema.findById(des_id, function (err, description) {
        const {user_like_array} = description;
        var response = {};
        if (user_like_array.indexOf(user_id) === -1){
            // user haven't like this one
            DescriptionSchema.findByIdAndUpdate(des_id, { $inc: {like: 1}, $push: {user_like_array: user_id} }, {new: true}, function (err, description) {
                if (err) return handleError(err);
                response.ans = true;
                // return accepted as signal
                res.status(200).json(response);
            });
        }else{
            // user already liked this one
            response.ans = false;
            // return refused as signal
            res.status(200).json(response);
        }
    });

});


// simulate load query result from db
function loadResultList(location) {
    const results = {};
    const resultNum = rnd(3,8);
    const resultArray = []
    for (let i = 0; i < resultNum; i++){
        let tempJson = {};
        tempJson.userName = 'user-' + i;
        tempJson.rank = rnd(0,300);
        tempJson.discription = 'rank' + i + 'xxxxxxxxxxxxxxxxxx';
        resultArray.push(tempJson);
    }
    resultArray.sort(function(a, b) {
        return parseInt(b.rank) - parseInt(a.rank);
    });
    results.location = location;
    results.resultArray = resultArray;
    results.autoComment = 'autoComment is here';

    return results;
}

// produce a random number
function rnd(start, end){
    return Math.floor(Math.random() * (end - start) + start);
}

//we need to get data from post request

export default router;
