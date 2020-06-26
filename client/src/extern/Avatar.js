import React, {Component} from "react";
import Modal from './Modal';
import axios from 'axios';

import './Modal.css';

class Avatar extends Component{
  constructor (){
    super();

    this.state = {
      show: false,
      active: false,
      hover: false,
      hoverID: null,
      avatar_url: null,
      error: null,
      token: ''

    };

    this.toggleHover = this.toggleHover.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.importImages = this.importImages.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkForCurrentAvatar(){
    console.log("i've been called");
    let activeAvatar = null;
    let activeParent = null;
    console.log(this.state.avatar_url);

    if(this.state.avatar_url != null){
      activeAvatar = document.querySelector(".modal-main--label--image[src='"+this.state.avatar_url+"']");
      activeParent = activeAvatar.parentNode;

      activeAvatar.style.transform = 'translateY(-10px)';
      activeParent.style.border = '4px solid #0ABDC6';
      activeParent.style.padding = '14px';

    }
  }

  toggleHover = ( index) =>{
    this.setState({hover: !this.state.hover, hoverID: index});
  };

  toggleActive = (index, event) =>{
    this.setState({active: !this.state.active});
  };


  showModal = () =>{
    this.setState({show: true});
  };

  hideModal = () =>{
    this.setState({show: false});
  };

  importImages = (r) =>{
    return r.keys().map(r);
  };

  componentDidMount = () =>{
    const token = this.props.token;
    let header = {'Authorization': 'Bearer ' + token};
    axios.get('http://localhost:8000/api/avatar', {headers:header})
      .then((response) => {
        console.log(response);
        this.setState({avatar_url: response.data});
      });
  };

  handleSubmit(event) {
    event.persist();
    console.log("submitted");
    const token = localStorage.getItem('jwt');
    let data = {avatar_url: this.state.avatar_url};
    let header = {'Authorization': 'Bearer ' + token};
    axios.post('http://localhost:8000/api/avatar', data, {headers:header})
    .then((response) => {
      console.log(response);
      // this.setState({ error: '', });
    })
    .catch((error) => {
      const status = error.response.status;
      if (status === 500) {
        this.setState({ error: 'Avatar could not be set' });
      }
    });
  }

  RemoveBaseUrl = (url) =>{

    let baseUrlPattern;
    let result;
    let match;

    baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/;
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

    var hoverStyle = {};

    let imageID = null;
    let labelID = null;

    let allLabels = null;
    let allImages = null;

    this.checkForCurrentAvatar();

    if(this.state.hoverID != null){
      imageID = document.getElementById('avatar'+this.state.hoverID);
      labelID = document.getElementById('avatar_label'+this.state.hoverID);
      allLabels = document.querySelectorAll(".modal-main--label:not(#avatar_label"+this.state.hoverID+")");
      allImages = document.querySelectorAll(".modal-main--label--image:not(#avatar_label"+this.state.hoverID+")");

      if(this.state.hover === true){
        this.state.hover = false;
        [...allLabels].map((i) => {
          i.style.border = null;
          i.style.padding = null;
        });

        [...allImages].map((i) => {
          i.style.transform = 'translateY(0px)';
        });

        imageID.style.transform = 'translateY(-10px)';
        labelID.style.border = '4px solid #0ABDC6';
        labelID.style.padding = '14px';

        let url = imageID.src;
        let result = this.RemoveBaseUrl(url);

        this.state.avatar_url = result;


      //  console.log(this.avatar_url, imageID.src);
      }else if(this.state.hover === false){

        [...allLabels].map((i) => {
          i.style.border = null;
          i.style.padding = null;
          return
        });

        [...allImages].map((i) => {
          i.style.transform = 'translateY(0px)';
          return
        });

        imageID.style.transform = 'translateY(0px)';
        labelID.style.border = null;
        labelID.style.padding = null;
      }
    }

    const images = this.importImages(require.context('../img/avatars', false, /\.(svg)/));
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

// const container = document.createElement("div");
// document.body.appendChild(container);
// ReactDOM.render(<Avatar/>, container);


export default Avatar;
