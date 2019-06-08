//The computer will pick a number and the user will guess it
//The computer will tell the user higher or lower or that they're correct

/**********Boiler Plate Begin ************/
const readline = require("readline");
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/**********Boiler Plate End ************/

//Picks a random integer using the min and max values given to the function
function randomInteger(min, max) {
  let range = max - min + 1;
  return min + Math.floor(Math.random() * range);
}

start();

async function start() {
  let userGuesses = [];
  let tries = 1;
  let minNumber;
  let maxNumber;
  //let stringMin = await ask("What would you like the lower limit to be? ");
  //let min = parseInt(stringMin);
  //let stringMax = await ask("What would you like the upper limit to be? ");
   //let max = parseInt(stringMax);
  while (minNumber !== parseInt(minNumber)) {
    let stringMin = await ask("Type in the lower limit: ");
    minNumber = parseInt(stringMin);
    if(minNumber !== parseInt(minNumber)){
      console.log("Please enter an integer value.");
    }
  }
  while (!(maxNumber === parseInt(maxNumber))) {
    let stringMax = await ask("Type in the upper limit: ");
    maxNumber = parseInt(stringMax);
    if(maxNumber !== parseInt(maxNumber)){
      console.log("Please enter an integer value.");
    }
  }

  let secretNumber = randomInteger(minNumber, maxNumber);
  console.log("My secret number is: " + secretNumber);
  //Start guessing
  let guess = await ask("What's your guess? ");

  while (true) {
    userGuesses.push(guess);
    if (guess < secretNumber) {
      console.log("Nope. My number is higher.");
    } else if (guess > secretNumber) {
      console.log("Nope. My number is lower.");
    } else if (!parseInt(guess)){
      console.log("That wasn't a number! But I'm counting it as a guess.");
    } else {
      console.log("You got it!\nYour number of guesses: " + tries);
      console.log("Your guesses were: "+ userGuesses);
      break;
    }
    tries++;
    guess = await ask("What's your guess? ");
  }

  process.exit();
}
