import React, {Component} from 'react';
import PropTypes from 'prop-types';

import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

import './Admin.css';

class Admin extends Component {
  state = {
    status: 'Loading...',
    loggedIn: false,
    admin: false
  };

  authenticate = () => {
    firebase.auth().onAuthStateChanged(this.loggedIn);
  };

  login = () => {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  };

  loggedIn = userEntry => {
    if (!userEntry) {
      this.setState({status: 'You are not authenticated'});
      return;
    }

    const userRef = firebase
      .firestore()
      .collection('users')
      .doc(userEntry.uid);

    userRef.get().then(userDoc => {
      this.setState({loggedIn: true});
      if (userDoc.exists) {
        if (userDoc.data().admin) {
          this.initAdmin(userDoc.data().name);
        } else {
          this.setState({status: 'You are not an administrator.'});
        }
      } else {
        this.setState({status: 'You are not an administrator.'});
        userRef.set({
          name: userEntry.displayName,
          admin: false
        });
      }
    });
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({loggedIn: false, admin: false});
      });
  };

  initAdmin = name => {
    this.setState({
      admin: true,
      status: 'Welcome, ' + name
    });
  };

  navigate = event => {
    this.props.history.replace(event.target.dataset.url);
  };

  componentDidMount() {
    initFirebase();
    this.authenticate();
  }

  render() {
    return (
      <div className="page">
        <h1 className="admin-title">Admin Panel</h1>
        <p>{this.state.status}</p>
        {!this.state.loggedIn &&
          this.state.status !== 'Loading...' && (
            <button className="button button-admin" onClick={this.login}>
              Authenticate
            </button>
          )}
        {this.state.admin && (
          <div>
            <div>
              <button
                className="button button-admin"
                data-url="/admin/collection"
                onClick={this.navigate}>
                Data Collection
              </button>
              <button
                className="button button-admin"
                data-url="/admin/approval"
                onClick={this.navigate}>
                Data Review
              </button>
              <button
                className="button button-admin"
                data-url="/admin/preview"
                onClick={this.navigate}>
                Data Preview
              </button>
            </div>
          </div>
        )}
        {this.state.loggedIn && (
          <button className="button button-admin" onClick={this.logout}>
            Logout
          </button>
        )}
      </div>
    );
  }
}

Admin.propTypes = {
  history: PropTypes.object.isRequired
};

export default Admin;
