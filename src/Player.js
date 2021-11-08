import React from "react";

const Player = (props) => {
  // if props render content en anders return error message
  if (props) {
    const progressBarStyles = {
      width: (props.data.progress_ms * 100) / props.data.item.duration_ms + "%",
    };
    return (
      <section>
        <div className="player-wrapper">
          <div className="now-playing-img">
            <img alt="album cover" src={props.data.item.album.images[0].url} />
          </div>
          <div className="now-playing-info">
            <p>Currently playing: </p>
            <h1 className="now-playing-track-name">{props.data.item.name}</h1>
            <h3 className="now-playing-artist-name">{props.data.item.artists[0].name}</h3>
            {props.data.device != null && (
              <p style={{ paddingTop: "1em" }}>Wordt afgespeeld op: {props.data.device.name}</p>
            )}
          </div>
        </div>
        <div className="progress-wrapper">
          <div className="progress-bar" style={progressBarStyles} />
        </div>
      </section>
    );
  } else return <h1>Er is iets misgegaan met het laden van de player...</h1>;
};
export default Player;
