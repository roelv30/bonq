import React, {Component} from "react"; // import react and react component
import Modal from './Modal'; // Import modal component from Modal.js
import axios from 'axios'; // Import Axios library for api calls

import './Modal.css'; // Import CSS for Modal.js

class Avatar extends Component{
  constructor (){
    super();

    // Define states to be used
    this.state = {
      show: false, // Used to check if modal is being showed
      hover: false, // Used to check if an avatar item is hovered
      hoverID: null, // used to return which Avatar item is selected
      avatar_url: null, // used to send the image url to the database and to read the current set avatar
      error: null, // Used to set errors
      token: '' // Used for Authorization checks
    };

    //Bind all functions to be used by 'this'
    this.toggleHover = this.toggleHover.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.importImages = this.importImages.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //When render() gets called, check what avatar is set to the user and set this avatar to active
  checkForCurrentAvatar(){
    let activeAvatar = null;
    let activeParent = null;

    if(this.state.avatar_url != null){
      activeAvatar = document.querySelector(".modal-main--label--image[src='"+this.state.avatar_url+"']");
      if (activeAvatar) {
        activeParent = activeAvatar.parentNode;
        activeAvatar.style.transform = 'translateY(-10px)';
        activeParent.style.border = '4px solid #0ABDC6';
        activeParent.style.padding = '14px';
      }
    }
  }

  //Gets called when avatar item gets CLICKED, This will be the new set avatar
  toggleHover = ( index) =>{
    this.setState({hover: !this.state.hover, hoverID: index});
  };

  //Gets called when showModal button gets clicked. This sets show to True;
  showModal = () =>{
    this.setState({show: true});
  };

  //Gets called when the done button gets clicked. This sets show to False;
  hideModal = () =>{
    this.setState({show: false});
  };

  //This function is used to retrieve the location of certain files from a webpack directory given through 'r';
  importImages = (r) =>{
    return r.keys().map(r);
  };

  // This function gets called when the render() function gets called.
  componentDidMount = () =>{
    const token = this.props.token; // Get token from the given props.
    let header = {'Authorization': 'Bearer ' + token}; // set the header for the api request

    //Make the API GET request
    axios.get('https://bonq-api.herokuapp.com/api/avatar', {headers:header})
      .then((response) => {
        //Retrieve the current set Avatar of the user in the DB and set it in state.
        this.setState({avatar_url: response.data});
      });
  };

  // This function gets called when a radiobutton in the Avatar item gets clicked.
  handleSubmit(event) {
    event.preventDefault();
    event.persist();
    const token = localStorage.getItem('jwt'); // Retrieve the set jwt key for authentication
    let data = {avatar_url: this.state.avatar_url}; // Retrieve the set avatar_url state and set in variable
    let header = {'Authorization': 'Bearer ' + token}; // Define the authentication header for the API call

    //Send the set avatar_url to the database with an API POST request.
    axios.post('https://bonq-api.herokuapp.com/api/avatar', data, {headers:header})
    .then((response) => {
    })
    .catch((error) => { // catch any possible errors and check for a 500 error.
      const status = error.response.status;
      if (status === 500) {
        this.setState({ error: 'Avatar could not be set' });
      }
    });
  }

  // This function gets called when an avatar image path is retrieved from the REACT webserver and remove the base URL ('https://bonq.herokuapp.com')
  RemoveBaseUrl = (url) =>{

    let baseUrlPattern;
    let result;
    let match;

    baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/; //Returns warning error, ignore for functionality reasons
    result = "";

    match = baseUrlPattern.exec(url);
    if(match!=null){
      result = match[0];
    }

    if(result.length > 0){
      url = url.replace(result, "");
    }

    return url;
  }

  render(){
    // Initialise the used variables in render
    var hoverStyle = {};

    let imageID = null;
    let labelID = null;

    let allLabels = null;
    let allImages = null;

    //When render gets called check for a current set avatar.
    this.checkForCurrentAvatar();

    //Run this when an avatar is active
    if(this.state.hoverID != null){
      imageID = document.getElementById('avatar'+this.state.hoverID);
      labelID = document.getElementById('avatar_label'+this.state.hoverID);
      allLabels = document.querySelectorAll(".modal-main--label:not(#avatar_label"+this.state.hoverID+")");
      allImages = document.querySelectorAll(".modal-main--label--image:not(#avatar_label"+this.state.hoverID+")");

      // Check if an avatar item is SELECTED
      if(this.state.hover === true){
         this.state.hover = false;

         //Remove any SELECTED styling from avatar labels that are not selected
        [...allLabels].map((i) => {
          i.style.border = null;
          i.style.padding = null;
          return null;
        });

        //Remove any SELECTED styling from avatar images that are not selected
        [...allImages].map((i) => {
          i.style.transform = 'translateY(0px)';
          return null;
        });

        //Set the current SELECTED avatar item to SELECTED styling
        imageID.style.transform = 'translateY(-10px)';
        labelID.style.border = '4px solid #0ABDC6';
        labelID.style.padding = '14px';


        let url = imageID.src; //get the url for the selected avatar
        let result = this.RemoveBaseUrl(url); //Remove BASEURL from the selected avatar image

        this.state.avatar_url = result; // Set the current avatar_url state to the selected avatar image

        // If an avatar is selected, then...
      }else if(this.state.hover === false){

        //Remove any SELECTED styling from avatar labels that are not selected
        [...allLabels].map((i) => {
          i.style.border = null;
          i.style.padding = null;
          return null;
        });

        //Remove any SELECTED styling from avatar images that are not selected
        [...allImages].map((i) => {
          i.style.transform = 'translateY(0px)';
          return null;
        });

        imageID.style.transform = 'translateY(0px)';
        labelID.style.border = null;
        labelID.style.padding = null;
      }
    }


    const images = this.importImages(require.context('../img/avatars', false, /\.(svg)/)); // Retrieve all images from '../img/avatars' and retrieve the webpack url

    // Set all the avatar items based of the images in the folder and store them in 'imageList'
    var imageList = images.map((image, index) =>{
      return(
        <label id={"avatar_label"+index} key={index}
        onMouseDown={() => this.toggleHover(index)}
        // onMouseLeave={this.toggleHover(index)}
        className="modal-main--label"
        >
        <img className="modal-main--label--image " id={"avatar"+index} width="75px" src={image} style={hoverStyle} alt="Avatar"/>
        <input className="modal-main--label--radio" onChange={this.handleSubmit} name="avatar_input" type="radio"></input>
        </label>);
    });

    // Render the HTML with the modal component and render the image list. 
    return(
      <section>
        <Modal show={this.state.show} handleClose={this.hideModal} title="Select Avatar" button="Done">
          <form>
            {imageList}
          </form>
        </Modal>

        <button className="dashboard__article__details__avatar" type="button" onClick={this.showModal}>
          <figure>
            <img src={this.state.avatar_url} className="dashboard__article__details__avatar__image" alt="Your personal avatar"></img>
          </figure>
          <div className="dashboard__article__details__avatar__overlay">
            <p className="dashboard__article__details__avatar__overlay__label">Change Avatar</p>
            <img className="dashboard__article__details__avatar__overlay__image" src="img/edit.svg" alt="Edit Icon"/>
          </div>
        </button>
      </section>
    );
  }
}

export default Avatar;
