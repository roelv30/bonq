import React, {useEffect, useRef} from "react";
import Switch from "react-switch";
import io from "socket.io-client";





const Username = (props) => {

    return (

        <section>
            <div className="background">
                <div className="background__inside"></div>
            </div>
            <article>

                <h2 className={"headerLogin"}>What do you like <br/> to be called?</h2>
                <div className={"backgroundUsername"}>
                    <input type="text" name="username" value={props.userName} onChange={props.handleUsernameInput} className={"whiteText inputUsername"}
                       pattern="^\w+$" maxLength="20" required autoFocus
                       title="Username"/>
                </div>

                {/*<button className="primary-button" type="button" >Set username</button>*/}
                {/*<button onClick={setNextPage}>Next page</button>*/}

                <h2>Enable camera?</h2>
                <Switch onChange={props.handeChangeSwitch} checked={props.switchState}  />
                <br />
                <button className="start__article__button" type="button" onClick={props.startSession} >ENTER &#9654;</button>
            </article>

        </section>

    );
}

export default Username;
