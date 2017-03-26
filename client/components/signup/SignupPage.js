import React from 'react';
import SignupFrom from './SignupForm';
import WelToLogin from './WelToLogin';
import OuterAuth from '../common/OuterAuth';
import { connect } from 'react-redux';
import { userSignupRequest } from '../../actions/signupAction';
import { userLoginSocialRequest } from '../../actions/loginActionSocial'

class SignupPage extends React.Component {
    render() {

        // 1. import action creator, { userSignupRequest }, from outside, and it will be added to this.props by connect
        // in other words, { userSignupRequest } comes from connect

        // 2. Here, take { userSignupRequest } from props, and it will be passed to <SignupFrom />
        const { userSignupRequest, userLoginSocialRequest } = this.props;
        //const { userLoginSocialRequest } = this.props;
        console.log("Singup Page say: ", this.props );
        console.log("Singup Page send: ",{ userSignupRequest }," to Signup From");

        return (
            <div className="container loginPage">
                <div className="row centered">
                    <div className="col-md-3 login-page-block welcome-block">
                        <WelToLogin />
                    </div>

                    <div className="col-md-5 login-page-block login-block">
                        <SignupFrom userSignupRequest={userSignupRequest}/>

                    </div>
                    <div className="col-md-4 login-page-block login-block">
                        <OuterAuth userLoginSocialRequest={userLoginSocialRequest}/>
                    </div>
                </div>
            </div>
        )
    }
}

SignupPage.propTypes = {
    userSignupRequest: React.PropTypes.func.isRequired,
    userLoginSocialRequest: React.PropTypes.func.isRequired
}
export default connect( (state)=>{ return{}}, { userSignupRequest,  userLoginSocialRequest}) (SignupPage);
