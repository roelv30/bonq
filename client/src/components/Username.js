import React, {useEffect, useRef} from "react";
import Switch from "react-switch";
import io from "socket.io-client";





const Username = (props) => {

    return (

        <section>
            <div className="background">
                <div className="background__inside"></div>
            </div>
            <article className="username__article">

                <h2 className={"headerLogin"}>What do you like to be called?</h2>
                <div className={"backgroundUsername"}>
                    <input type="text" name="username" value={props.userName} onChange={props.handleUsernameInput} className={"whiteText inputUsername"}
                           pattern="^\w+$" maxLength="20" required autoFocus
                           title="Username"/>
                </div>

                {/*<button className="primary-button" type="button" >Set username</button>*/}
                {/*<button onClick={setNextPage}>Next page</button>*/}
                <section class="username__article__enable">
                <h2 className="username__article__enable__text">Enable camera?</h2>
                <Switch className="username__article__enable__button" onChange={props.handeChangeSwitch} checked={props.switchState}  />
                </section>

                <button className="start__article__button username__article__enter" type="button" onClick={props.startSession} >ENTER &#9654;</button>
            </article>

        </section>

    );
}

export default Username;
