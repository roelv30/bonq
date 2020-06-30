import React, {useEffect, useRef} from "react";
import Switch from "react-switch";





const Username = (props) => {

    return (
        <section>
            <article>
                <h2>Choose a username</h2>
                <input type="text" name="username" value={props.userName} onChange={props.handleUsernameInput} className={"whiteText"}
                       pattern="^\w+$" maxLength="20" required autoFocus
                       title="Username"/>
                <button className="primary-button" type="button" onClick={props.startSession}>Set username</button>
                {/*<button onClick={setNextPage}>Next page</button>*/}
            </article>
            <article>
                <h2>Enable camera?</h2>
                <Switch onChange={props.handeChangeSwitch} checked={props.switchState}  />
            </article>

        </section>

    );
}

export default Username;
