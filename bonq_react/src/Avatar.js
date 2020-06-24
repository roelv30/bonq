import React, {Component} from "react";
import ReactDOM from 'react-dom';
import App from './App';
import Modal from './Modal';
import axios from 'axios';
import listReactFiles from 'list-react-files';

import './css/Modal.css';

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
    const token = localStorage.getItem('jwt');
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

    let activeAvatar = null;
    let activeParent = null;

    if(this.state.avatar_url != null){
      activeAvatar = document.querySelector(".modal-main--label--image[src='"+this.state.avatar_url+"']");
      activeParent = activeAvatar.parentNode;

      activeAvatar.style.transform = 'translateY(-10px)';
      activeParent.style.border = '4px solid #0ABDC6';
      activeParent.style.margin = '6px';

    }

    if(this.state.hoverID != null){
      imageID = document.getElementById('avatar'+this.state.hoverID);
      labelID = document.getElementById('avatar_label'+this.state.hoverID);
      allLabels = document.querySelectorAll(".modal-main--label:not(#avatar_label"+this.state.hoverID+")");
      allImages = document.querySelectorAll(".modal-main--label--image:not(#avatar_label"+this.state.hoverID+")");

      if(this.state.hover === true){
        this.state.hover = false;
        [...allLabels].map((i) => {
          i.style.border = null;
          i.style.margin = null;
        });

        [...allImages].map((i) => {
          i.style.transform = 'translateY(0px)';
        });

        imageID.style.transform = 'translateY(-10px)';
        labelID.style.border = '4px solid #0ABDC6';
        labelID.style.margin = '6px';

        let url = imageID.src;
        let result = this.RemoveBaseUrl(url);

        this.state.avatar_url = result;


      //  console.log(this.avatar_url, imageID.src);
      }else if(this.state.hover === false){

        [...allLabels].map((i) => {
          i.style.border = null;
          i.style.margin = null;
        });

        [...allImages].map((i) => {
          i.style.transform = 'translateY(0px)';
        });

        imageID.style.transform = 'translateY(0px)';
        labelID.style.border = null;
        labelID.style.margin = null;
      }
    }

    const images = this.importImages(require.context('./img/avatars', false, /\.(svg)/));
    var imageList = images.map((image, index) =>{
      return(
        <label id={"avatar_label"+index} key={index}
        onMouseDown={() => this.toggleHover(index)}
        // onMouseLeave={this.toggleHover(index)}
        className="modal-main--label"
        >
        <img className="modal-main--label--image " id={"avatar"+index} width="75px" src={image} style={hoverStyle}/>
        <input className="modal-main--label--radio" onChange={this.handleSubmit} name="avatar_input" type="radio"></input>
        </label>);
    });

    return(
      <section>
        <h1>React Modal</h1>
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <h1>Select Avatar</h1>
          <form>
            {imageList}
          </form>
        </Modal>
        <img src={this.state.avatar_url} width="100px"></img>
        <button type="button" onClick={this.showModal}>
          Open
        </button>
      </section>
    );
  }
}

// const container = document.createElement("div");
// document.body.appendChild(container);
// ReactDOM.render(<Avatar/>, container);


export default Avatar;
