/*
 * This component renders 2 components that forms reset password page
 * It uses the state from redux store
 */

import React from 'react';
import ForgotPwd from './ForgotPwd';
import ResetPwd from './ResetPwd';
import { connect } from 'react-redux';
import { resetpwdRequest } from '../../actions/resetpswdAction';
import LinkToHome from './../common/LinkToHome';

class ResetPasswordPage extends React.Component{
    render(){

        const { resetpwdRequest } = this.props;
        return(
           <div className="float_on_the_map-large ">
               <div className="">
                   <div className="col-md-offset-3 col-md-2 reset-pwd-page-block-dark window-drop-shadow">
                       <ForgotPwd />
                   </div>
                   <div className="col-md-4 reset-pwd-block reset-pwd-page-block window-drop-shadow">
                       <LinkToHome/>
                       <ResetPwd resetpwdRequest={resetpwdRequest}/>
                   </div>
               </div>
           </div>
        );
    }

}

ResetPasswordPage.propTypes = {
    resetpwdRequest: React.PropTypes.func.isRequired
}

//export default ResetPasswordPage;
export default connect( (state)=>{ return{}}, { resetpwdRequest }) (ResetPasswordPage);
