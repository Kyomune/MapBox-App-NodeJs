const inquirer = require("inquirer");
require("colors");

const inquirerMenu = async () => {
  const questions = [
    {
      type: "list",
      name: "option",
      message: "¿Qué desea hacer?",
      choices: [
        { value: "1", name: `${"1.".green} Buscar Ciudad` },
        { value: "2", name: `${"2.".green} Historial` },
        { value: "0", name: `${"0.".green} Salir` },
      ],
    },
  ];
  //   console.clear();

  console.log("==========".green);
  console.log(" Seleccione una opción ");
  console.log("==========\n".green);

  const { option: opt } = await inquirer.prompt(questions);

  return opt;
};

const pause = async () => {
  const pressForContinue = {
    type: "input",
    name: "key",
    message: `Presione ${"enter".green} para continuar`,
  };

  console.log("\n");
  await inquirer.prompt(pressForContinue);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }

        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);

  return desc;
};

const placesList = async (places = []) => {
  const choices = places.map(({ id, name }, index) => {
    const idx = `${index + 1}.`.green;
    return {
      value: id,
      name: `${idx} ${name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const questions = [
    { type: "list", name: "id", message: "Seleccione lugar", choices },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

const confirm = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const showCheckList = async (taskes = []) => {
  const choices = taskes.map(({ id, desc, ending }, index) => {
    const idx = `${index + 1}.`.green;
    return {
      value: id,
      name: `${idx} ${desc}`,
      checked: ending ?? false,
    };
  });

  const question = [
    { type: "checkbox", name: "ids", message: "Seleccione", choices },
  ];

  const { ids } = await inquirer.prompt(question);
  return ids;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  placesList,
  confirm,
  showCheckList,
};
