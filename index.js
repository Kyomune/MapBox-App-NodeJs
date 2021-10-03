require("dotenv").config();

const {
  inquirerMenu,
  pause,
  readInput,
  placesList,
} = require("./helpers/inquirer");
const Search = require("./models/search");

const main = async () => {
  let response = null;
  const search = new Search();

  do {
    response = await inquirerMenu();

    switch (response) {
      case "1":
        const city = await readInput("Ciudad: ");

        const places = await search.city(city);

        if (places.length === 0) {
          console.log("No se han encontrado lugares.");
          break;
        }

        const id = await placesList(places);

        if (id === "0") continue;

        const placeSelected = places.find((places) => places.id === id);

        search.addHistory(placeSelected.name);

        const { weatherDescription, min, max, temperature } =
          await search.weather({
            lat: placeSelected.lat,
            lng: placeSelected.lng,
          });

        search.saveDB()

        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", placeSelected.name);
        console.log("Lat:", placeSelected.lat);
        console.log("Lng:", placeSelected.lng);
        console.log("Temperatura:", temperature);
        console.log("Mínima:", min);
        console.log("Máxima:", max);
        console.log("Clima:", `${weatherDescription}`.green);
        break;

        case "2":
          search.historyCapitalize.forEach((place, i) => {
            const idx =  `${i + 1}`.green
            console.log( `${idx} ${place}`)
          })
        break;
    }

    if (response !== "0") await pause();
  } while (response !== "0");
};

main();
