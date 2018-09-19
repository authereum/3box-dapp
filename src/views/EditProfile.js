import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { address } from '../utils/address'
import { openBox, getPublicName, getPublicGithub, getPublicImage, getPrivateEmail } from '../state/actions';
import * as routes from '../utils/routes';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Loading from '../assets/Loading.svg';
import './styles/EditProfile.css';

const Buffer = require('buffer/').Buffer;

class EditProfile extends Component {
  constructor(props) {
    super(props);
    const { name, github, email } = this.props;
    this.state = {
      name: null,
      github: null,
      email: null,
      buffer: null,
      showPicModal: false,
      disableSave: true,
      disableSavePic: true,
      picLoading: false,
      saveLoading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { name, github, email } = this.props;
    this.setState({ name, github, email });
  }

  componentWillReceiveProps(props) {
    const { name, github, email } = props;
    this.setState({ name, github, email });
  }

  handleFormChange = (e, property) => {
    this.setState({ [property]: e.target.value, disableSave: false });
  }

  handleUpdatePic = (photoFile) => {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(photoFile);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer.from(reader.result), disableSavePic: false });
    };
  }

  handleSubmitPic = (e) => {
    const { buffer } = this.state;
    const { threeBoxObject } = this.props;
    const { profileStore } = threeBoxObject;
    // const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

    e.preventDefault();
    this.setState({ picLoading: true });
    // ipfs.files.add(buffer, (err, res) => {
    threeBoxObject.ipfs.files.add(buffer, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      this.setState({ ipfsHash: res[0].hash });
      profileStore.set('image', [{ '@type': 'ImageObject', contentUrl: { '/': res[0].hash } }])
        .then(result => console.log(result))
        .then(() => {
          this.props.getPublicImage();
          this.setState({ picLoading: false, showPicModal: false });
        });
    });
    // }
  }

  handlePicModal = () => {
    const { showPicModal } = this.state;
    this.setState({ showPicModal: !showPicModal, disableSavePic: true });
  }

  // removeStore = (key, method) => {
  //   const { threeBoxObject } = this.props;
  //   const { profileStore, privateStore } = threeBoxObject;

  //   if (method === 'profileStore') {
  //     profileStore.remove(key)
  //       .then(() => this.props.openBox());
  //   } else {
  //     privateStore.remove(key)
  //       .then(() => this.props.openBox());
  //   }
  // }

  removePic = () => {
    const { threeBoxObject } = this.props;
    const { profileStore } = threeBoxObject;
    this.setState({ picLoading: true });
    profileStore.remove('image')
      .then(() => {
        this.props.openBox();
        this.setState({ picLoading: false, showPicModal: false });
      });
  }

  async handleSubmit(e) {
    const { name, github, email } = this.state;
    const { history, threeBoxObject } = this.props;
    const { profileStore, privateStore } = threeBoxObject;

    e.preventDefault();
    this.setState({ saveLoading: true });

    // if value has changed, switch boolean to save to db
    let nameChanged = false;
    let githubChanged = false;
    let emailChanged = false;
    name === this.props.name ? nameChanged = false : nameChanged = true;
    github === this.props.github ? githubChanged = false : githubChanged = true;
    email === this.props.email ? emailChanged = false : emailChanged = true;

    console.log(nameChanged);
    console.log(githubChanged);
    console.log(emailChanged);

    // if value changed and is not empty, save new value, else remove value
    (nameChanged && name !== '') ? await profileStore.set('name', name) : await profileStore.remove(name);
    (githubChanged && github !== '') ? await profileStore.set('github', github) : await profileStore.remove(github);
    (emailChanged && email !== '') ? await privateStore.set('email', email) : await profileStore.remove(github);

    // only get values that have changed
    nameChanged && await this.props.getPublicName();
    githubChanged && await this.props.getPublicGithub();
    emailChanged && await this.props.getPrivateEmail();

    this.setState({ saveLoading: false });
    history.push(routes.PROFILE);
  }

  render() {
    const {
      image,
    } = this.props;
    const { showPicModal, name, github, email, disableSave, disableSavePic, picLoading, saveLoading } = this.state;

    return (
      <div>
        {picLoading
          && (
            <div className="loadingContainer">
              <img src={Loading} alt="loading" id="loadingPic" />
            </div>
          )}
        {showPicModal
          && (
            <div className="container">
              <div className="modal">
                {image.length > 0
                  ? <img src={`https://ipfs.io/ipfs/${image[0].contentUrl['/']}`} alt="profile" id="edit_modal_user_picture" />
                  : <div id="edit_modal_user_picture" />
                }
                {image.length > 0 && <button id="removePic" className="removeButton" onClick={this.removePic} text="remove" type="button">X</button>}

                <p>Edit profile picture</p>
                <form onSubmit={this.handleSubmitPic}>
                  <label htmlFor="fileInput" id="chooseFile">
                    <input id="fileInput" type="file" name="pic" className="light" accept="image/*" onChange={e => this.handleUpdatePic(e.target.files[0])} ref={ref => this.fileUpload = ref} />
                    {(this.fileUpload && this.fileUpload.files && this.fileUpload.files[0]) ? this.fileUpload.files[0].name : 'Choose a file'}
                  </label>
                  <button id="saveModal" type="submit" disabled={disableSavePic}> Save</button>
                </form>
                <button onClick={e => this.handlePicModal(e)} type="button" className="tertiaryButton" id="closeModal">close</button>
              </div>
            </div>)}
        <Nav />
        <Link to="/Profile">
          <div id="goBack">
            &larr; Profile
          </div>
        </Link>

        <div id="edit">
          <p className="header">Edit Profile</p>

          <div id="edit_page">
            <div id="edit_user_picture">
              {image.length > 0
                ? <img src={`https://ipfs.io/ipfs/${image[0].contentUrl['/']}`} alt="profile" className="profPic" />
                : <div className="profPic" />
              }
              <button onClick={this.handlePicModal} type="button" className="secondaryButton">Edit photo</button>
            </div>

            <div id="edit_user_public">

              {saveLoading
                && (
                  <div className="container">
                    <img src={Loading} alt="loading" id="loadingPic" />
                  </div>
                )}

              <div className="edit_form">

                <h3>Ethereum Address</h3>
                <p id="edit_address">{address}</p>

                <h3>Name</h3>
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={e => this.handleFormChange(e, 'name')}
                />
                {/* <button className="removeButton" type="button" onClick={() => this.removeStore('name', 'profileStore')}>X</button> */}


                <h3>Github</h3>
                <input
                  name="github"
                  type="text"
                  value={github}
                  onChange={e => this.handleFormChange(e, 'github')}
                />
                {/* <button className="removeButton" type="button" onClick={() => this.removeStore('github', 'profileStore')}>X</button> */}

              </div>
            </div>

            <div id="edit_user_private">
              <div id="privateHeader">
                <p className="subheader">Private</p>
                <p className="subtext">This information is accessible only by those with permission.</p>
              </div>

              <div className="edit_form">

                <h3>Email Address</h3>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => this.handleFormChange(e, 'email')}
                />
                {/* <button className="removeButton" type="button" onClick={() => this.removeStore('email', 'privateStore')}>X</button> */}

              </div>

            </div>
          </div>
          <div id="formControls">
            <button type="submit" disabled={disableSave} onClick={e => this.handleSubmit(e)}>Save</button>
            <Link to="/Profile" className="subtext" id="edit_cancel">
              Cancel
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

EditProfile.propTypes = {
  threeBoxObject: PropTypes.object,
  name: PropTypes.string,
  github: PropTypes.string,
  email: PropTypes.string,
  image: PropTypes.array,
  openBox: PropTypes.func,
  history: PropTypes.object,

  getPublicName: PropTypes.func,
  getPublicGithub: PropTypes.func,
  getPublicImage: PropTypes.func,
  getPrivateEmail: PropTypes.func,
};

EditProfile.defaultProps = {
  threeBoxObject: {},
  name: '',
  github: '',
  email: '',
  image: [],
  history: {},

  openBox: openBox(),
  getPublicName: getPublicName(),
  getPublicGithub: getPublicGithub(),
  getPublicImage: getPublicImage(),
  getPrivateEmail: getPrivateEmail(),
};

function mapState(state) {
  return {
    threeBoxObject: state.threeBoxData.threeBoxObject,
    name: state.threeBoxData.name,
    github: state.threeBoxData.github,
    email: state.threeBoxData.email,
    image: state.threeBoxData.image,
  };
}

export default withRouter(connect(mapState, { openBox, getPublicName, getPublicGithub, getPublicImage, getPrivateEmail })(EditProfile));