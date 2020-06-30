import React from 'react';
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import './Share.css';

//USE THIS COMPONENT IN HOST SECTION TO INVITE FRIENDS FOR GAME

const Share = () => {

  //Take the current URL, should be something like  https://bonq.herokuapp.com/r/{ROOMCODE}
  const url = window.location.href;

  //Message that will be sent in Whatsapp
  const text = "Hey there!\nI've hosted my own Pubquiz with bonq 🎉\nFollow this link to join the game:\n"

  return (
    <section className="share">
      <WhatsappShareButton
        title={text}
        url={url}>
        <WhatsappIcon round={true} size={30}/>
        <h1 className="share__text">Click here to send an invite to your friends!</h1>
      </WhatsappShareButton>
    </section>
  )
}

export default Share;