import React, { useEffect } from "react";

const Sound = ({ audioURI }) => {
  useEffect(() => {
    const audio = new Audio(audioURI);
    audio.play();
  }, [audioURI]);
  return <></>;
};

export default Sound;
