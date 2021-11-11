import React, { useEffect, useState } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import Visualizer from "./visualizer";
import "./styles/App.css";

import spotifyProvider from "./utility/spotifyProvider";
import cleanDataFunctions from "./cleanDataFunctions";

const App = () => {
  const [count, setCount] = useState(0);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect om te checken of er iets update als dat gebeurd en er is een token dan interval initieren
  useEffect(() => {
    // hash is een export function van hash.js
    if (hash.access_token) {
      // if count = 0 dan is de gebruiker pas net ingelogd, om ervoor te zorgen dat de gebruiken niet 3s hoeft te wachten 1x getData
      // op deze manier uitvoeren
      if (count === 0) getData();
      const refreshData = tickerInterval();
      return () => clearInterval(refreshData);
    }
  }, []);

  // tickerInterval die elke 3s getData() uitvoerd
  const tickerInterval = () => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
      getData();
    }, 3000);
    return interval;
  };

  const getData = async () => {
    if (count === 0) setLoading(true);
    try {
      // voer de functie getCurrentPlayingTrack uit in spotifyProvider
      await spotifyProvider
        .getCurrentPlayingTrack(hash.access_token)
        .then((player) => {
          // als dit gelukt is zet het resultaat in de state maar set deze nog niet
          state.player = player;
          // console.log(player);
          // geef de player door naar de volgende functie
          return player;
        })
        .then((res) => {
          // voer de volgende spotifyProvider functie uit om artist data op te halen, geef de artist id van de player mee
          const artist = spotifyProvider.getArtistData(hash.access_token, res.item.artists[0].id);
          return artist;
        })
        .then((data) => {
          // om de followers netjes te tonen voer een functie uit om dit met komma's te seperaten
          let clean = cleanDataFunctions.integerSeperator(data);
          return clean;
        })
        .then((res) => {
          // reken het percentage uit van populariteit
          let percentage = cleanDataFunctions.getPopularityPercentage(res);
          return percentage;
        })
        .then((percentage) => {
          // op basis van het percentage voeg de data toe aan het object in woorden
          let popularity = cleanDataFunctions.getPopularityEmotion(percentage);
          // voeg de popularity toe aan de state maar set deze nog niet
          state.artist = popularity;
          return popularity;
        });

      if (state.artist) {
        // deze functie had in de chain moeten staan, echter had ik een error en geen tijd meer om dit te fixen dus dan maar zo
        const relatedArtists = await spotifyProvider.getRelatedArtists(
          hash.access_token,
          state.player.item.artists[0].id
        );
        // voeg toe aan state maar set nog niet
        state.relatedArtists = relatedArtists;
      }

      if (state.artist) {
        const topTracks = await spotifyProvider.getUserTopPicks(hash.access_token);
        state.top = topTracks;
      }

      if (state.artist) {
        const audio = await spotifyProvider.getAudioData(hash.access_token, state.player.item.id);
        state.audio = audio;
      }
      // set state met de nieuwe objecten zodat we dit kunnen laten zien in de dom
      setState(state);
      if (!loading) setLoading(false);
    } catch (err) {
      // if error setError in state zodat je dit kan tonen in de dom
      setError(err.message);
      setLoading(false);
    }
  };

  console.log(state);

  return (
    <>
      {/* if state.player bestaat render PLayer component en geef de data mee als prop */}
      <header>{state.player && <Player data={state.player} />}</header>
      <section>
        {/* als er geen token is is de user niet ingelogd en moet dit dus nog doen */}
        {!hash.access_token && (
          <div className="login-btn-container">
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}>
              Login met Spotify
            </a>
          </div>
        )}
        {state.audio && <Visualizer data={state.audio} />}
        {/* if het object in de state staat render dan het component en geeft de data mee als prop */}
        {/* als er een token is maar geen player dan speelt de user geen muziek af en heeft de app dus ook geen data om te laten zien */}
        {hash.access_token && !state.player && (
          <div className="login-btn-container">
            <h1>Je moet een nummer afspelen om data te kunnen zien</h1>
          </div>
        )}

        {error && <h1>{error.message}</h1>}
      </section>
    </>
  );
};

export default App;
