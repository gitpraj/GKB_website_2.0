/*
 * This is add description component
 * It is contained by SearchResultLit
 */

import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

class AddDescription extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            content: ''
        }
        this.onClickClose = this.onClickClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    onClickClose(){
        this.props.hideAddWindow();
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onClickSubmit() {
        const content = this.state.content;
        const { _id } = this.props.contributor;
        const { placeFullAddr} = this.props.placeInfo;
        const { userName } =  this.props.contributor;
        const {user} = this.props.login;
        const description = {
            user_id : _id,
            user_name : userName,
            placeFullAddr: placeFullAddr,
            description_content: content,
            type: this.props.searchResult.searchResultPageConfig.type,
            image: this.props.searchResult.searchResultPageConfig.placePhoto,
            coords: user.coords
        }

        this.props.updateShowSearchResult(description).then(this.props.hideAddWindow())

    }

    render(){
        return(
            <div className="float_on_the_map">
                <div className="small-window col-md-offset-3 col-md-6 add_description window-drop-shadow">
                    <div className="form-group-n">
                        <div className="form-title">
                            <h4>Add Description</h4>
                            <div className="btn-close-float">
                                <Link onClick={this.onClickClose}> x </Link>
                            </div>
                        </div>

                        <div className="form-content">
                            <div className="form-content-description">
                                <p>
                                    Contribute your own short description to help others navigate to this location.
                                </p>
                            </div>
                            <div>
                                <input className="form-control input-w-60 margin-small"
                                       placeholder="Text Description"
                                       value={this.state.content}
                                       onChange={this.onChange}
                                       name="content"
                                       type="text"
                                       maxLength="140"/>
                                <p className="text-align-right">{this.state.content.length}/140</p>
                            </div>

                            <button type="submit"
                                    className="btn btn-default btn-login margin-small"
                                    onClick={this.onClickSubmit}>Submit</button>
                            <div>
                                <Link className="margin-small"
                                      onClick={this.onClickClose}>Cancel</Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        );
    }
}


AddDescription.propTypes = {
    hideAddWindow: React.PropTypes.func.isRequired,
    updateShowSearchResult: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        contributor: state.login.user,
        placeInfo: state.searchResult.searchResultPageConfig,
        searchResult: state.searchResult,
        login: state.login
    };
}

export default connect(mapStateToProps, null) (AddDescription);
