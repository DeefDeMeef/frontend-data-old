import React from "react";

import "./styles/artistData.css";

const ArtistData = (props) => {
  return (
    <>
      <h1 style={{ padding: "1em 1em 0em 1em" }}>Artiest data</h1>
      <article className="artist-wrapper">
        {/* if props.data render content */}
        {props.data !== null && (
          <section className="artist-block artist-data">
            <img className="artist-avatar" src={props.data.images[0].url} alt="artist profile pic" />
            <div className="credentials-wrapper">
              <p>
                <span className="bold">Artiest: </span>
                {props.data.name}
              </p>
              <p>
                <span className="bold">Volgers: </span>
                {props.data.followers.total}
              </p>
            </div>
          </section>
        )}
        <section className="artist-block">
          <p>
            <span className="bold">Genres: </span>
          </p>
          {/* laat max 3 genres zien en als er geen genres zijn zet 'geen genres' neer */}
          {props.data.genres[0] ? (
            props.data.genres
              .map((item, index) => {
                return (
                  <p key={index} style={{ textTransform: "capitalize" }}>
                    {item}
                  </p>
                );
              })
              .slice(0, 3)
          ) : (
            <p>Geen genre(s) bekend</p>
          )}
        </section>
        <section className="artist-block">
          <p>
            <span className="bold">Populariteit in procent: </span>
            {props.data.popularity}%
          </p>
          <p>
            <span className="bold">Populariteit in woorden: </span>
            {props.data.emotion}
          </p>
          <p>
            <span className="bold">Populariteit in een visualisatie:</span>
          </p>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p>0</p>
            <div className="popularity-bar">
              <div className="popularity-bar-inner" style={{ width: props.data.percentage + "%" }}></div>
            </div>
            <p>100</p>
          </div>
        </section>
      </article>
    </>
  );
};

export default ArtistData;
