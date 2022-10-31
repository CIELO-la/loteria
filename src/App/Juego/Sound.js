import React, { useEffect } from "react";

const Sound = ({ playAudio, audioURI }) => {
  useEffect(() => {
    playAudio(audioURI);
  }, [playAudio, audioURI]);
  return(<></>);
};

export default Sound;
