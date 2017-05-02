import React from 'react';
import LinkToHome from '../common/LinkToHome';
import {Link} from 'react-router';
class SearchHistory extends React.Component{
    render(){
        return(
            <div className="vertical-block col-md-offset-1 col-md-8">

                <div className="vertical-block-title">
                    <h3>Search History</h3>
                    <LinkToHome/>
                </div>

                <div className="vertical-block-content">
                    <div className="history-button">
                        <Link to ="/home"/>Add to Favourites
                        <Link to="/signup"/>
                        Delete
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" id="blankCheckbox" value="option1" aria-label="..." />
                            </label>
                        </div>
                    </div>


                    <div>
                        <h5>Date</h5>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" value="" />
                                    Option one is this and that be sure to include why it's great
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" value="" />
                                    Option two is disabled
                            </label>
                        </div>
                    </div>

                    <div>
                        <h5>Date</h5>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" value="" />
                                Option one is this and that be sure to include why it's great
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" value="" />
                                Option two is disabled
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default SearchHistory;