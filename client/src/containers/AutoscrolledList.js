import React from "react";
import autoscroll from "autoscroll-react";
import moment from 'moment';
import './AutoscrolledList.css';
const styles = {
    overflowY: "scroll",
    height: "200px",
    borderTop: "2px solid #D10C76",
    marginTop: "2rem",
    padding: "0 1.5rem"
};

class List extends React.Component {
    render() {
        const { items } = this.props;

        return (
            <ul style={styles} {...this.props}>
                {items.map(({ user, date, text }, index) => (
                    <div key={index} className="row mb-2">
                        <div className="col-md-2"><img className="chat__avatar" src="/static/media/30.49476a15.svg"/><span className="chat__name">{user.name}</span> <span className="chat__team"> | {user.team}</span> <span className="chat__time">{moment(date).format("h:mm:ss a")} </span> <p className="chat__message">{text}</p><hr className="chat__divider"/></div>
                    </div>
                ))}
                {/*{items.map(item => <li>{item}</li>)}*/}
            </ul>
        );
    }
}

export default autoscroll(List, { isScrolledDownThreshold: 100 });
