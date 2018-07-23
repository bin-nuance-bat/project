import React, {Component} from 'react';
import firebase from 'firebase/app';
import initFirebase from '../../utils/firebase';
import 'firebase/auth';

class Auth extends Component {
    state = {
        status: 'Authenticating...'
    }
    
    componentDidMount() {
        initFirebase();
        firebase.auth().getRedirectResult().then(result => {
            if (result.user) {
                this.setState({status: 'User authenticated: ' + result.user.uid});
            } else {
                firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
            }
        }).catch(function(error) {
            console.error(error);
        });
    }

    render() {
        return <h1>{this.state.status}</h1>;
    }
}

export default Auth;