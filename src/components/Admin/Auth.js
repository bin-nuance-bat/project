import React, {Component} from 'react';
import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

class Auth extends Component {
    state = {
        status: 'Authenticating...'
    }
    
    componentDidMount() {
        initFirebase();
        firebase.auth().getRedirectResult().then(result => {
            if (result.user) {
                firebase.firestore().collection('users').doc(result.user.uid).set({
                    name: result.user.displayName,
                    admin: false
                });
                this.props.history.push('/admin');
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