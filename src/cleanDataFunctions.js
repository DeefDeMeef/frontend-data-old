class CleanDataFunctions {
  integerSeperator(data) {
    // normale duizendtal notatie geen idee hoe het heet maar het word 1,000,000 ipv 1000000
    data.followers.total = data.followers.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return data;
  }

  getPopularityPercentage(data) {
    // reken percentage uit
    const percentage = (data.popularity * 100) / 100;
    data.percentage = percentage;
    return data;
  }

  getPopularityEmotion(data) {
    // switch case om te zeggen hoe bekend iemand is in woorden
    const x = data.popularity;
    switch (true) {
      case x < 20:
        data.emotion = "Niet bekend 🥺";
        break;
      case x >= 20 && x <= 40:
        data.emotion = "Niet zo bekend 🙂";
        break;
      case x >= 40 && x <= 60:
        data.emotion = "Gemiddeld bekend 😊";
        break;
      case x >= 60 && x <= 80:
        data.emotion = "Best bekend 😄";
        break;
      case x >= 80 && x <= 100:
        data.emotion = "Mega bekend 🤩";
        break;
      default:
        data.emotion = "Laden...";
        break;
    }
    return data;
  }
}

export default new CleanDataFunctions();
