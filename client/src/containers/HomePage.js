import React from 'react'
import Home from '../components/Home'
import PropTypes from 'prop-types';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    console.log("props");
    console.log(props);

  }
  state = {
    value: new Date() - new Date().setHours(0, 0, 0, 0),
    username: '',

    checked: false
  };
  static contextTypes = {
    router: PropTypes.object
  };
  setRoom = () => this.setState({value: new Date() - new Date().setHours(0, 0, 0, 0)})
  joinRoom = e => {

    e.preventDefault();

    //this.props.history.push('hello');
    console.log(this.state.checked);
    this.props.history.push('r/' + this.state.value );

  };
  setUsername = (e) => {

    e.preventDefault();

    //this.state.username = e.target.value;
    console.log("state username");
    console.log(this.state.username);


  };
  handleChange = e => this.setState({value: e.target.value});
  handleChangeUsername = e => this.setState({username: e.target.value});
  handleSwitch  = (checked) => {
    console.log("changed");
    //console.log(e.target.checked);
    this.setState({ checked });
   // this.setState({switch: checked });
  };

  render(){
    return (
      <Home
          roomId={this.state.value}
          handleChange={this.handleChange}
          handleUsernameInput={this.handleChangeUsername}
          handeChangeSwitch ={this.handleSwitch}
          setStateSwitch={this.state.checked}
          joinRoom={this.joinRoom}
          setRoom={this.setRoom}
          setUsername={this.setUsername}
          rooms={this.props.rooms}
    />
    );
  }
}


//const mapStateToProps = store => ({rooms: store.rooms, username: store.username });
//export default connect(mapStateToProps)(HomePage);
export default HomePage;
//const mapStateToProps = store => ({rooms: new Set([...store.rooms])});
