import React, {useEffect, useRef} from "react";
import Room from "../containers/Room";
import styled from "styled-components";

const StyledVideo = styled.video`
    // height: 40%;
    // width: 50%;
`;



const Video = (props) => {
    const ref = useRef();
    // console.log(props);
    useEffect(() => {

        props.peer.on("stream", stream => {
            console.log(props);
            if(props.type === false){
                ref.current.srcObject = null;
                ref.current.poster = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
            }else{
                ref.current.srcObject = stream;
            }
            // console.log("needed stream:::");
            // console.log(stream);
            //console.log(stream);

        })

    }, []);

    // console.log("peer stream:::");
    // console.log(props.peer);
    return (
        <section>
            <StyledVideo playsInline autoPlay ref={ref} id={props.socketID} />
            <p id={props.socketID}>{props.username}</p>
        </section>


    );
}

export default Video;
