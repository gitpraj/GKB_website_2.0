import React, {Component} from "react";
import GoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";
import "react-google-places-suggest/lib/index.css";
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { addSearchHistory } from '../../actions/addSearchHistory';
import axios from 'axios';

const MY_API_KEY = "AIzaSyBYNqtR2RJBsq44d31RZe2Znch8_SX4RXM"

class MyGoogleSuggest extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchStr: "",
            selectedCoordinate: {},
            errors: {}
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSelectSuggest = this.handleSelectSuggest.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick(e) {

        //console.log('GO is clicked ************');
        this.props.showSearchResult();


    }

    handleSearchChange(e) {
        this.setState({searchStr: e.target.value})
    }

    handleSelectSuggest(suggest, coordinate, place, directionsResponse) {
        // query apache jena database, if not then go with google.
        const {user} = this.props.login;
        // console.log("this props landingpage flag: ", this.props.landingPageFlag);
        // var flag = this.props.landingPageFlag;
        console.log("search term to jena: ", suggest.terms[0].value);
        this.setState({errors: {} });
        var toSend;
        if (user._id == null) {
            toSend = {
                searchStr: suggest.terms[0].value,
                user_id: null,
                fulladdr: suggest.description
            }
        } else {
            toSend = {
                searchStr: suggest.terms[0].value,
                user_id: user._id,
                fulladdr: suggest.description,
            }
        }
        console.log("searchBarRequest:", toSend);

        this.setState({searchStr: suggest.description,
                        selectedCoordinate: coordinate});

        if (place.photos) {
            toSend.photo = place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
        }else{
            toSend.photo = '';
        }
        toSend.coordinate = coordinate;
        toSend.suggestDescription = suggest.description;
        //axios.post('/api/searchBar', toSend);
        this.props.searchBarRequest(toSend);
            // .then(
            //     (res) => {
            //         console.log("we are back in searchBar clientside");
            //     },
            //     // if server response any error message, set it into state errors
            //     (err) => {
            //         var photo = "";
            //         this.setState({searchStr: suggest.description, selectedCoordinate: coordinate}, function() {
            //             if (place.photos) {
            //                 console.log("photo1: ", place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}));
            //                 photo = place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200})
            //             } else {
            //                 photo = ""
            //             };
            //             var userData = {
            //                 email: user.email,
            //                 userName: user.userName,
            //                 accountType: user.accountType,
            //                 proImg: user.proImg,
            //                 _id: user._id,
            //                 showSearchResult: true,
            //                 coords: {
            //                     lat: this.state.selectedCoordinate.latitude,
            //                     longt: this.state.selectedCoordinate.longitude
            //                 },
            //                 directions:directionsResponse.routes[0].overview_path,
            //
            //             }
            //             const descriptionArray = err.response.data;
            //             const conf = {
            //                 showSearchResult: true,
            //                 placeFullAddr:suggest.description,
            //                 placePhoto: photo
            //             }
            //             // call action to set ShowSearchResult
            //             this.props.setShowSearchResult(conf);
            //             // call action to set DescriptionArray
            //             this.props.setDescriptionArray(descriptionArray);
            //
            //             //this.props.addSearchHistory(history_data);
            //             console.log("updateCoordsRequest: ", userData)
            //             this.props.updateCoordsRequest(userData);
            //
            //         })
            //     }
            // );
      //
      // this.props.searchBarRequest(toSend)
      //     .then(
      //     // after server response then...
      //     // if successful
      //     //var userUpdated = this.props.login.user;
      //     (res) => {
      //         console.log("we are back in searchBar clientside");
      //
      //     },
      //     // if server response any error message, set it into state errors
      //     (err) => {
      //         var photo = "";
      //         this.setState({searchStr: suggest.description, selectedCoordinate: coordinate}, function() {
      //             if (place.photos) {
      //               console.log("photo1: ", place.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}));
      //               photo = place.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
      //             } else {
      //               photo = ""
      //             };
      //             var userData = {
      //               email: user.email,
      //               userName: user.userName,
      //               accountType: user.accountType,
      //               proImg: user.proImg,
      //               id: user.id,
      //                 proImg: user.proImg,
      //                 showSearchResult: true,
      //               coords: {
      //                 lat: this.state.selectedCoordinate.latitude,
      //                 longt: this.state.selectedCoordinate.longitude
      //               },
      //               directions:directionsResponse.routes[0].overview_path,
      //
      //             }
      //             console.log("err response: ", err.response)
      //             if (err.response.data.searchHistory) {
      //                 console.log("err.response.searchHistory: ", err.response.data.searchHistory)
      //                 userData.searchHistory = err.response.data.searchHistory;
      //             }
      //             //const descriptionArray = err.response.descriptionArray
      //             // Changing thw whole functionality. For now let descriptionArray is null
      //             var descriptionArray = null;
      //             const conf = {
      //                 showSearchResult: true,
      //                 placeFullAddr:suggest.description,
      //                 placePhoto: photo,
      //                 type: "google"
      //             }
      //             console.log("conf conf: ", conf)
      //             this.props.setShowSearchResult(conf);
      //
      //             //if (descriptionArray) {
      //             this.props.setDescriptionArray(descriptionArray);
      //             // }
      //             this.props.updateCoordsRequest(userData);
      //           // if (flag) {
      //           //     console.log("just before routing to mapContainer")
      //           //    browserHistory.push('/map');
      //           // }
      //
      //         })
      //     }
      // );

    }

    render() {
        const {searchStr} = this.state;
        const {googleMaps} = this.props;
//{errors.searchBar && <span className="help-block">{errors.searchBar}</span> }

        return (
            <GooglePlacesSuggest
                googleMaps={googleMaps}
                onSelectSuggest={this.handleSelectSuggest}
                search={searchStr}
            >


                <div className="col-lg-6">
                    <div className="input-group">
                        <input
                            type="text"
                            value={searchStr}
                            className="form-control"
                            placeholder="Search a location"
                            onChange={this.handleSearchChange}
                        />

                        <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.buttonClick}>Go!</button>
                  </span>
                    </div>
                </div>

            </GooglePlacesSuggest>
        )
    }
}

MyGoogleSuggest.propTypes = {
    searchBarRequest: React.PropTypes.func.isRequired,
    login: React.PropTypes.object.isRequired,
    updateCoordsRequest: React.PropTypes.func.isRequired,
    setDescriptionArray: React.PropTypes.func.isRequired,
    landingPageFlag: React.PropTypes.any
}

MyGoogleSuggest.contextTypes = {
    router: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
    console.log('mapStateToProps: ',state.login);
    //console.log('mapStateToPropsCoords: ',state.coords);
    return {
        login: state.login,
        //coords: state.coords
    };
}

// GoogleMapLoader(MyGoogleSuggest, {
//   libraries: ["places"],
//   key: MY_API_KEY,
// })

export default connect(mapStateToProps, { addSearchHistory })(GoogleMapLoader(MyGoogleSuggest, {
    libraries: ["places"],
    key: MY_API_KEY,
}));
