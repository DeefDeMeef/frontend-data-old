import React from "react";

const RelatedArtists = (props) => {
  return (
    <>
      <h1 style={{ padding: "0em 1em" }}>Relatieve artiesten</h1>

      <section className="related-artist-wrapper">
        {/* if props.data render dan de content */}
        {props.data &&
          props.data.artists
            .map((item, index) => {
              return (
                <article key={index}>
                  {item.images[1].url && (
                    <img className="artist-avatar" src={item.images[1].url} alt="artist avatar" />
                  )}
                  <h4>{item.name}</h4>
                  <p>{item.followers.total}</p>

                  <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <button className="btn-small">Bekijk profiel</button>
                  </a>
                </article>
              );
            })
            // laat er max 5 zien
            .slice(0, 5)}
      </section>
    </>
  );
};

export default RelatedArtists;
