/*
 * This component forms a single favourite location entry
 * This is used by favourite list
 */

import React from 'react';
import {Link} from 'react-router';
import { searchBarRequest } from '../../actions/searchBarAction';
import { updateCoordsRequest} from '../../actions/updateCoords';
import { setShowSearchResult } from '../../actions/setShowSearchResult';
import { setDescriptionArray }from '../../actions/setDescriptionArray';
import { googlePlaceSearchRequest } from '../../actions/googlePlaceSearch.js';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import config from '../../../server/config.js';

class FavouriteItem extends React.Component{

  constructor(props){
      super(props);
      this.state = {
          searchStr: "",
          errors: {}
      }
      this.linkClick = this.linkClick.bind(this);
  }

  linkClick(searchStr) {

      console.log("link click in searchHistory")
      console.log("searchStr", searchStr)
      const {user} = this.props.login;
      this.setState({errors: {} });
      var toSend;
      if (user._id == null) {
          toSend = {
              searchStr: "",
              user_id: null,
              fulladdr: searchStr,
              button: false
          }
      } else {
          toSend = {
              searchStr: "",
              user_id: user._id,
              fulladdr: searchStr,
              button: false
          }
      }
      console.log("searchBarRequest11:", toSend);

      this.props.searchBarRequest(toSend)
          .then(
              // after server response then...
              // if successful
              (res) => {
                  console.log("we are back in searchHistory clientside");

                  const token = res.data.token;
                  // get token from server side, and store the token into session storage
                  // sessionStorage.removeItem('loginToken');
                  // sessionStorage.setItem('loginToken', token);
                  // setAuthorizationToken(token);
                  // decode token, get user msg from it
                  console.log('decode token: ',token);
                  var userData = token
                  if (userData._id == null) {
                      //dispatch(setCurrentUserGuest(jwt.decode(token)));
                      this.props.updateCoordsRequest(userData);
                      const conf = {
                          showSearchResult: true,
                          placeFullAddr:userData.placeFullAddr,
                          placePhoto: "",
                          type: "jena"
                      }
                      console.log("conf conf: ", conf)
                      //dispatch(setSearchResultList(conf));
                      if (token.descriptionArray) {
                          console.log("token descriptionArray line 90 googleAuto");
                          this.props.setDescriptionArray(token.descriptionArray);
                      } else {
                          this.props.setDescriptionArray({});
                      }
                      this.props.setShowSearchResult(conf);
                  } else {
                      // dispatch action 'setCurrentUser' to change state
                      //dispatch(setCurrentUser(jwt.decode(token)));
                      this.props.updateCoordsRequest(userData);
                      // set show result component
                      const conf = {
                          showSearchResult: true,
                          placeFullAddr:userData.placeFullAddr,
                          placePhoto: "",
                          type: "jena"
                      }
                      console.log("conf conf: ", conf)
                      //dispatch(setSearchResultList(conf));
                      if (token.descriptionArray) {
                          console.log("token descriptionArray line 110 googleAuto");
                          this.props.setDescriptionArray(token.descriptionArray);
                      } else {
                          this.props.setDescriptionArray({});
                      }
                      this.props.setShowSearchResult(conf);
                  }

                  browserHistory.push('/home');

              },
              // if server response any error message, set it into state errors
              (err) => {
                  console.log("in google searchHistory")
                  var photo = "";
                  var obj = {
                    searchStr: searchStr
                  }
                  this.props.googlePlaceSearchRequest(obj).then(
                      (res) => {
                          console.log("in googlePlaceSearch client for searchHistory");
                          const data = res.data.obj;
                          console.log("the data we got back from google searchHistory clicked: ", data)
                          user.coords = {lat: data.lat, longt: data.lng};
                          // no direction for this
                          user.directions = null
                          console.log("err  response: ", err.response)
                          if (err.response.data.searchHistory) {
                              console.log("err.response.searchHistory: ", err.response.data.searchHistory)
                              user.searchHistory = err.response.data.searchHistory;
                          }

                          if (err.response.data.autoDescription) {
                              console.log("err.response.autoDescription searchHistory: ", err.response.data.autoDescription)
                              user.autoDescription = err.response.data.autoDescription;
                          } else {
                              user.autoDescription = null
                          }

                          //const descriptionArray = err.response.descriptionArray
                          // Changing thw whole functionality. For now let descriptionArray is null
                          var descriptionArray = err.response.data.descriptionArray;
                          const conf = {
                              showSearchResult: true,
                              placeFullAddr:searchStr,
                              placePhoto: data.photo,
                              type: "google"
                          }
                          console.log("conf conf: ", conf)
                          this.props.setShowSearchResult(conf);

                          if (descriptionArray) {
                              this.props.setDescriptionArray(descriptionArray);
                          } else {
                              this.props.setDescriptionArray({});
                          }
                          this.props.updateCoordsRequest(user);
                          // if (this.props.landingPageFlag == true) {
                          //     console.log("just before routing to mapContainer")
                          //     browserHistory.push('/home');
                          // }
                          browserHistory.push('/home');
                      },
                      (err) => {
                          console.log("in googlePlaceSearch error client");
                      }
                  )

              }
          );

    }

    render(){
        var {img} = this.props;
        console.log("img type in favourite "+ img);
        if(img == '' || img == null){
            img = "http://www.mozmagic.com/files/assets/img/ui/no-image-available.png"
        } else if (img.indexOf("https") < 0) {
            // result is from google place photo => photo_ref
            img = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + img + "&key=" + config.googlePlaceApiKey
        }

        return(
            <div className="favourite-item-box">
                <div className="favourite-img col-md-2">
                    <img className="stretch-img" src={img}/>
                </div>
                <div className="col-md-offset-3 col-md-9 favourite-content">
                    <Link onClick={this.linkClick.bind(this, this.props.location)} className="favourite-content-title">
                    <h5>{this.props.location}</h5>
                    </Link>

                    <div className="favourite-content-body">
                    <h6>{this.props.description}</h6>
                    </div>
                </div>
            </div>
        );
    }
}

FavouriteItem.propTypes = {
    searchBarRequest: React.PropTypes.func.isRequired,
    login: React.PropTypes.object.isRequired,
    updateCoordsRequest: React.PropTypes.func.isRequired,
    setDescriptionArray: React.PropTypes.func.isRequired,
    setShowSearchResult: React.PropTypes.func.isRequired,
    googlePlaceSearchRequest: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
    console.log('mapStateToProps: ',state.login);
    //console.log('mapStateToPropsCoords: ',state.coords);
    return {
        login: state.login
    };
}

export default connect(mapStateToProps, {searchBarRequest,
                                        updateCoordsRequest,
                                        setShowSearchResult,
                                        setDescriptionArray,
                                        googlePlaceSearchRequest})(FavouriteItem);
