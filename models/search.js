const fs = require("fs");

const axios = require("axios");

class Search {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    this.loadDB();
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPEN_WEATHER,
      units: "metric",
      lang: "es",
    };
  }

  get historyCapitalize() {
    return this.history.map((place) => {
      let words = place.split(" ");
      words = words.map((w) => w[0].toUpperCase() + w.substring(1));

      return words.join(" ");
    });
  }

  async city(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });
      const {
        data: { features },
      } = await instance.get();

      return features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async weather({ lat, lng }) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          ...this.paramsWeather,
          lat,
          lon: lng,
        },
      });

      const {
        data: { weather, main },
      } = await instance.get();

      return {
        weatherDescription: weather[0].description,
        temperature: main.temp,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistory(place = "") {
    if (this.history.includes(place.toLocaleLowerCase())) return;

    this.history = this.history.splice(0, 5);

    this.history.unshift(place.toLocaleLowerCase());
  }

  saveDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  loadDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.history = data.history;
  }
}

module.exports = Search;
