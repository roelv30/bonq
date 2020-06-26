import React from "react";
import autoscroll from "autoscroll-react";
import moment from 'moment';
const styles = {
    overflowY: "scroll",
    height: "300px"
};

class List extends React.Component {
    render() {
        const { items } = this.props;

        return (
            <ul style={styles} {...this.props}>
                {items.map(({ user, date, text }, index) => (
                    <div key={index} className="row mb-2">
                        <div className="col-md-2">{moment(date).format("h:mm:ss a")} | {user.name} ({user.team}) | {text}</div>
                    </div>
                ))}
                {/*{items.map(item => <li>{item}</li>)}*/}
            </ul>
        );
    }
}

export default autoscroll(List, { isScrolledDownThreshold: 100 });
