/*
 * Landing page is the first view when a user visit this applicaiton
 */

import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import NavBar from '../home/NavBar';
import {connect} from 'react-redux';
import { searchBarRequest } from '../../actions/searchBarAction';
import { updateCoordsRequest} from '../../actions/updateCoords'
import { setShowSearchResult } from '../../actions/setShowSearchResult';
import { setDescriptionArray }from '../../actions/setDescriptionArray';
import {setContributionArray} from '../../actions/setContributionArray';
import { setGoButtonResultsArray } from '../../actions/goButtonResults'
import GoogleAutoSuggest from '../googleMaps/GoogleAutoSuggest'
import MapContainer from '../googleMaps/MapContainer'

class landingPage extends React.Component{
    render(){

        return(
            <div className="jumbotron">

                <div className="col-md-12 landingPage">
                    <div>
                        <NavBar login={this.props.login}/>
                    </div>
                    <h3 className="title-white">Locate your destination in one sentence</h3>
                    <br/>
                    <div className="landing-search-bar" >
                        <GoogleAutoSuggest searchBarRequest={this.props.searchBarRequest}
                                           updateCoordsRequest={this.props.updateCoordsRequest}
                                           setShowSearchResult={this.props.setShowSearchResult}
                                           setDescriptionArray={this.props.setDescriptionArray}
                                           setGoButtonResultsArray={this.props.setGoButtonResultsArray}
                                           landingPageFlag = {true}
                                           showAutoSuggest={this.showAutoSuggest}
                                           hideSearchResult={this.hideSearchResult}>

                            <Router history={browserHistory}>
                                <Route path="/" component={MapContainer}/>
                                <Route path="home" component={MapContainer}/>
                                <Route path="map" component={MapContainer}/>

                            </Router>

                        </GoogleAutoSuggest>

                    </div>
                    <p><a className="btn" href="#" role="button">Learn more</a></p>
                </div>

            </div>
        );
    }
}

landingPage.propTypes = {
    login: React.PropTypes.object.isRequired,
    searchBarRequest: React.PropTypes.func.isRequired,
    updateCoordsRequest: React.PropTypes.func.isRequired,
    setGoButtonResultsArray: React.PropTypes.func.isRequired,
    setDescriptionArray: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        login: state.login,
    };
}
export default connect(mapStateToProps,{ searchBarRequest, updateCoordsRequest, setContributionArray, setGoButtonResultsArray, setDescriptionArray, setShowSearchResult})(landingPage);
