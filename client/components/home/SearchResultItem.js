import React from 'react';
import thumbPic from '../img/thumb.png';
import userPic from '../img/user.png';
import classNames from 'classnames';
import defaultPhoto from '../img/default-profile-picture.jpg';
import axios from 'axios';


class SearchResultItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            clicked: false,
            like: this.props.like
        }
        this.onThumbClicker = this.onThumbClicker.bind(this);
    }

    onThumbClicker(){

        const auth = this.props.auth;

        if (auth){
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

                axios.post('/api/searchBar/addLike', addLikeRequest).then(res =>{
                    //const description = res.data;
                    console.log("*************");
                    console.log(res.data);
                    const {ans} = res.data;
                    if (ans)  {
                        this.setState({
                        clicked: !this.state.clicked,
                        like: this.state.like + 1
                        });
                    }else{
                        alert("alread liked this one");
                    }
                    // return res.data;
                    // dispatch(setSearchResultList(descriptionArray));
                });

            }
        }else{
            alert("please login");
        }

    }

    render() {

        var btnClass = classNames({
            'thumb': true,
            'thumbUp': this.state.clicked,
            'thumbUp': this.props.preThumbUp
        });
        var userProfile;
        if(this.props.proImg.contentType != null){
            const proImg = this.props.proImg;
            const base64 = (Buffer.from(proImg.data).toString('base64'));
            userProfile = 'data:'+proImg.contentType+';base64,'+base64;
        }else{
            // console.log("********************");
            // console.log(this.props.proImg);
            userProfile = defaultPhoto;
        }

        return (
            <div className = "result_box">
                <div className = "user_box" >
	                <span> Rank {this.props.num} </span>
                    <img src = {userProfile}
                         className = "user" />
                    <span> {this.props.userName} </span>
                </div>
                <div className = "like_box" >
	                <div>
                        <img src = {thumbPic}
                             onClick = {this.onThumbClicker}
                             className = {btnClass}/>
                    </div >
                    <div>
                        <span> {this.state.like}</span>
                    </div>
	            </div>
                <p>
	                <span><strong> Discription: </strong></span > {this.props.discription}
                </p>
            </div >
        );
    }

}

SearchResultItem.propTypes = {
    clickLike: React.PropTypes.func.isRequired,
    auth: React.PropTypes.bool.isRequired,
    user_id: React.PropTypes.string.isRequired
}
export default SearchResultItem;
