import React from 'react';
import ProfileContent from './ProfileContent';
import Dropzone from '../DropZone';
import {addProImgAction} from '../../actions/addProImgAction.js'
import { connect } from 'react-redux'; 

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        const { user } = this.props.login;
        const { addProImgAction } = this.props;
        return(
            <div>
                <button className="btn btn-default profile-btn-on-map  btn-unfold-sidebar"
                        data-toggle="modal" data-target="#profile-modal"> 》 </button>

                <div className="modal"  id="profile-modal">
                    <div className="col-md-3 sidebar">
                        <button data-dismiss="modal" className="btn btn-default btn-fold-sidebar">《 </button>
                        <div className="profile-section">
                            <Dropzone user = {user} addProImgAction={addProImgAction}/>
                            <div className="center-text">{user.userName}</div>
                        </div>
                        <div className="profile-att">
                            <ProfileContent />
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

Profile.propTypes = {
    login: React.PropTypes.object.isRequired,
    addProImgAction: React.PropTypes.func.isRequired
}

export default connect( null, { addProImgAction}) (Profile);
