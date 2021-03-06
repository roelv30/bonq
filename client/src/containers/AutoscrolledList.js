import React from "react";
import autoscroll from "autoscroll-react";
import moment from 'moment';
import './AutoscrolledList.css';
const styles = {
    overflowY: "scroll",
    height: "calc(20rem - 2rem)",
    borderBottom: "2px solid #D10C76",
    padding: "0 1.5rem",
    wordBreak: "break-all",
};

class List extends React.Component {
    render() {
        const { items } = this.props;
        return (
            <ul style={styles} {...this.props}>
                {items.map(({ user, date, text }, index) => (
                    <div key={index} className="row mb-2">
                        <div className="col-md-2 chat"><img className="chat__avatar" src={this.props.avatar}/><span className="chat__name">{user.name}</span> <span className="chat__team"> | {user.team}</span> <span className="chat__time">{moment(date).format("h:mm:ss a")} </span> <p className="chat__message">{text}</p></div>
                    </div>
                ))}
            </ul>
        );
    }
}

export default autoscroll(List, { isScrolledDownThreshold: 100 });
