import React from "react";
import Switch from "react-switch";

const Username = (props) => {

    return (
        <section>
            <div className="background">
                <div className="background__inside"/>
            </div>
            <article className="username__article">

                <h2 className={"headerLogin"}>How do you like to be called?</h2>
                <div className={"backgroundUsername"}>
                    <input type="text" name="username" value={props.userName} onChange={props.handleUsernameInput} className={"whiteText inputUsername"}
                           pattern="^\w+$" maxLength="20" required autoFocus
                           title="Username"/>
                </div>
                <section className="username__article__enable">
                <h2 className="username__article__enable__text">Enable camera?</h2>
                <Switch className="username__article__enable__button" onChange={props.handeChangeSwitch} checked={props.switchState}  />
                </section>

                <section className="username__article__enter">
                <button className="start__article__button username__article__enter__button" type="button" onClick={props.startSession} >ENTER &#9654;</button>
                </section>
            </article>

        </section>

    );
}

export default Username;
