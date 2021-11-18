class SpotifyProvider {
  // spotify API calls
  async getCurrentPlayingTrack(token) {
    let response = await fetch("https://api.spotify.com/v1/me/player", {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    // if statuscode 200 return response ander null, hierdoor laat de frontend ook niks zien omdat het null is en de components dan niet
    // renderen
    if (response.ok) return response.json();
    else return null;
  }

  async getArtistData(token, id) {
    let response = await fetch("https://api.spotify.com/v1/artists/" + id, {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) return response.json();
    else return null;
  }

  async getRelatedArtists(token, id) {
    let response = await fetch("https://api.spotify.com/v1/artists/" + id + "/related-artists", {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) return response.json();
    else return null;
  }

  async getAudioData(token, trackId) {
    let response = await fetch("https://api.spotify.com/v1/audio-analysis/" + trackId, {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) return response.json();
    else return null;
  }

  async getUserTopPicks(token) {
    let response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) return response.json();
    else return null;
  }

  async getAudioFeatures(token, trackId) {
    let response = await fetch("https://api.spotify.com/v1/audio-features/" + trackId, {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) return response.json();
    else return null;
  }
}

export default new SpotifyProvider();
