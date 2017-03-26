import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose} from 'redux';

import LoginPage from './components/login/LoginPage';
import SignupPage from './components/signup/SignupPage';
import ResetPasswordPage from './components/resetpwd/ResetPasswordPage';
import EmailSentPage from './components/resetpwd/EmailSentPage';
import NewPwdPage from './components/newpassword/NewPwdPage';
import InitialPage from './components/googleMaps/MapBox'
import setAuthorizationToken from './utils/setAuthorizationToken';
import rootReduce from './reducer/rootReducer';
import jwt from 'jsonwebtoken';
import { setCurrentUser } from './actions/loginAction';
import userProfile from './components/test/userProfile';
/*
* createStore(reducer, [preloadedState], enhancer)
* Here, set an empty func (state = {}) => state as reducer
* No preloadedState
* set middleware thunk as enhancer
* thunk allows us to do asynchronous dispatch
* 被 dispatch 的 function 会接收 dispatch 作为参数，并且可以异步调用它。这类的 function 就称为 thunk。
* */




const store = createStore(
    rootReduce,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
)

if (localStorage.jwtToken) {
    setAuthorizationToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)));
}


render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={LoginPage}/>
            <Route path="/login" component={LoginPage}/>
            <Route path="/signup" component={SignupPage}/>
            <Route path="/resetpassword" component={ResetPasswordPage}/>
            <Route path="/emailsentpage" component={EmailSentPage}/>
            <Route path="/welcome" component={InitialPage}/>
            <Route path="/newpwd" component={NewPwdPage}/>
            <Route path="/userProfile" component={userProfile}/>
        </Router>
    </Provider>
, document.getElementById('app'));
