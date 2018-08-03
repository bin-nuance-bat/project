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
    admin: false,
    models: [],
    currentModel: '',
    modelSelect: ''
  };

  authenticate = () => {
    firebase.auth().onAuthStateChanged(this.loggedIn);
  };

  login = () => {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  };

  loggedIn = user => {
    if (!user) {
      this.setState({status: 'You are not authenticated'});
      return;
    }

    const userRef = firebase
      .firestore()
      .collection('users')
      .doc(user.uid);

    userRef.get().then(u => {
      this.setState({loggedIn: true});
      if (u.exists) {
        if (u.data().admin) {
          this.initAdmin(u.data().name);
        } else {
          this.setState({status: 'You are not an administrator.'});
        }
      } else {
        this.setState({status: 'You are not an administrator.'});
        userRef.set({
          name: user.displayName,
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
    initFirebase();
    firebase
      .firestore()
      .collection('models')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState(prevState => {
            let state = {};
            if (doc.data().deployed)
              state = {currentModel: doc.id, modelSelect: doc.id};
            return {
              models: prevState.models.concat([
                {id: doc.id, timestamp: doc.data().timestamp}
              ]),
              ...state
            };
          });
        });
      });
  };

  selectModel = async () => {
    initFirebase();
    this.setState({status: 'Deploying model...'});
    const models = firebase.firestore().collection('models');
    await models.doc(this.state.currentModel).update({deployed: false});
    await models.doc(this.state.modelSelect).update({deployed: true});
    this.setState({
      currentModel: this.state.modelSelect,
      status: 'Model deployed!'
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
                data-url="/admin/training"
                onClick={this.navigate}>
                Model Training
              </button>
              <button
                className="button button-admin"
                data-url="/admin/imageapproval"
                onClick={this.navigate}>
                Training Data Review
              </button>
              <button
                className="button button-admin"
                data-url="/admin/preview"
                onClick={this.navigate}>
                Image Preview
              </button>
            </div>
            <div>
              <select
                value={this.state.modelSelect}
                onChange={e => this.setState({modelSelect: e.target.value})}>
                {this.state.models.map(model => (
                  <option key={model.id} value={model.id}>
                    {new Date(model.timestamp).toLocaleString() +
                      ' - ' +
                      model.id}
                  </option>
                ))}
              </select>
              <button
                className="button button-admin"
                onClick={this.selectModel}>
                Select Model
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
