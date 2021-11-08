// pak de hash uit de huidige url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    // deze functie returned alle params uit de url zodat deze global gebruikt kunnen worden
    return initial;
  }, {});

export default hash;
