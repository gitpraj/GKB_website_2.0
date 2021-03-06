/*
 * SearchResultItem is a UI component, only render the data sent from SearchResultList
 */

import React from 'react';
import thumbSrc from '../img/thumb.png';
import thumbUpSrc from '../img/thumbUp.png';
import defaultPhoto from '../img/default-profile-picture.jpg';
import axios from 'axios';
import lodash from 'lodash';


class SearchResultItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            clicked: this.props.preThumbUp,
            like: this.props.like
        }
        this.onThumbClicker = this.onThumbClicker.bind(this);
    }

    componentWillReceiveProps(){
        this.setState({
            clicked: this.props.preThumbUp,
            like: this.props.like
        });
    };

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    onThumbClicker(){

        const isAuthenticated = this.props.isAuthenticated;

        if (isAuthenticated){
            // if already clicked
            if(this.state.clicked){
                alert("you already liked this one")
            }
            // if this is the first click
            else{
                // send add like request
                const addLikeRequest = {
                    des_id :this.props.des_id,
                    user_id :this.props.user_id
                };
                this.props.updateShowSearchResultLike(addLikeRequest);

            }
        }else{
            alert("please login");
        }
    }

    render() {

        const preThumbUpL = (this.state.clicked  || this.props.preThumbUp);

        var userProfile;
        var thumbPic;

        if(preThumbUpL){
            thumbPic = thumbUpSrc
        }else{
            thumbPic = thumbSrc
        }

        if(!lodash.isEmpty(this.props.proImg)){
            const proImg = this.props.proImg;
            const base64 = (Buffer.from(proImg.data).toString('base64'));
            userProfile = 'data:'+proImg.contentType+';base64,'+base64;
        }else{
            userProfile = defaultPhoto;
        }

        return (
            <div className = "result_box">
                <div className = "like_box" >
                    {(this.props.num == 1) && <div className="path-2"></div>}
                    <div>
                        <img src = {thumbPic}
                             onClick = {this.onThumbClicker}
                             className = "thumb"/>
                    </div >
                    <div>
                        <span className="like_num"> {this.props.like}</span>
                    </div>
                </div>
                <div className = "user_box" >

                    <img src = {userProfile}
                         className = "user" />
                    <span> {this.props.userName} </span>
                </div>
                <div className="description">
                    <p>
                        {this.props.discription}
                    </p>
                </div>
            </div >
        );
    }

}

SearchResultItem.propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired
}

export default SearchResultItem;
