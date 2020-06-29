import React from 'react'
// import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
// import Switch from "react-switch";

const Home = (props) => {
  //console.log(props);
  return (
  <div className="home" id="home" test={"hello"}>
    <div>
      <h1 itemProp="headline">Bonq Video Room</h1>
      <p>Please enter a room name or code</p>
      <form onSubmit={props.joinRoom}>
        <input type="text" name="room" value={props.roomId} onChange={props.handleChange}
               pattern="^\w+$" maxLength="10" required autoFocus
               title="Room name should only contain letters or numbers."/>

        <button className="primary-button" type="submit">Join</button>

        <button className="primary-button" onClick={props.setRoom}>Random</button>



      </form>

      {/*{props.rooms.length !== 0 && <div>Recently used rooms:</div>}*/}
      {/*{[...props.rooms].map(room => <Link key={room} className="recent-room" to={'/r/' + room}>{room}</Link>)}*/}
    </div>
  </div>
)};
Home.propTypes = {
  handleChange: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired,
  setRoom: PropTypes.func.isRequired,
 // roomId: PropTypes.number.isRequired,
 // rooms: PropTypes.object.isRequired
};

export default Home;
