function preload() {
  //The URL is formatted according to the documentation provided by the developers in:
  //http://api.openweathermap.org
  //The text/string object is formatted with the location we want to use, and our own API key
  let url = "https://api.postcodes.io/postcodes/";
  //The URL is sent to the loadJSON that returns the data to the weather variable
  result = loadJSON(url);
}
