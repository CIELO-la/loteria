import React, { useEffect } from "react";

const Sound = ({ playAudio, audioURI }) => {
  useEffect(() => {
    playAudio(audioURI);
  }, [audioURI]);
  return(<></>);
};

export default Sound;
