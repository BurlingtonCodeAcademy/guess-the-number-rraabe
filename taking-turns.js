//To do: make a function for yes/no answers that checks the input and asks again if it doesn't understand
//To do: make a function for h/l answers that checks the input and asks again if it doesn't understand
//Other: Are there places I could use a ternary operator isn't of an if statement? console.log(true ? iftrue : iffalse)
/**********Boiler Plate Begin ************/
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/**********Boiler Plate End ************/

//Variables shared between games
let nextPlayer = null;
let playAgain = null;
let minNumber;
let maxNumber;
let totalComputerTries = 0;
let totalComputerWins = 0;
let totalUserTries = 0;
let totalUserWins = 0;


//This function gets an input from the user, checks to make sure its an number and stores it as an int
async function getNumber() {
  let inputNumber = "inappropriate start value";
  while (inputNumber !== parseInt(inputNumber)) {
    let inputString = await ask("");
    inputNumber = parseInt(inputString);
    if (inputNumber !== parseInt(inputNumber)) {
      console.log("Please enter an integer: ");
    }
  }
  return inputNumber;
}

//Picks a random integer using the min and max values given to the function
function randomInteger(min, max) {
  let range = max - min + 1;
  return min + Math.floor(Math.random() * range);
}

//This function asks the user if they want to keep playing and, if so, checks who guesses next
async function nextGame() {
  playAgain = await ask("\nDo you want to play again? (Y/N): ");
  if (playAgain.toLowerCase().includes('y')) {
    if (nextPlayer === "user") {
      userGuesses();
    } else {
      computerGuesses();
    }
  } else {
    //assumes no
    let averageComputerGuesses = totalComputerTries/totalComputerWins;
    let averageUserGuesses = totalUserTries/totalUserWins;

    console.log("\nNumber of games that I guessed correctly: " + totalComputerWins);
    console.log("My average number of guesses: " + averageComputerGuesses);

    console.log("\nNumber of games that you guessed correctly: " + totalUserWins);
    console.log("Your average number of guesses: " + averageUserGuesses);
    
    if(averageComputerGuesses > averageUserGuesses) {
      console.log("\nYou were better at this! Great job!");
    }else if(averageComputerGuesses < averageUserGuesses){
      console.log("\nI was better at guessing this time. Better luck next time.");
    }else{
      console.log("\nWe were evenly matched! Well played!");
    }

    console.log("\nIt was nice playing with you. Goodbye.");
    process.exit();
  }
}

//The user picks a number and the computer guesses
async function computerGuesses() {
  let gotIt = false; //tracks if the computer has correctly guessed the number
  let tries = 1; //If the computer doesn't guess correctly this value is incremented
  let allGuesses = []; //tracks guesses so they can't be repeated
  let lastGuess = null;

  console.log(
    "Let's play a game where you (human) make up a number and I (computer) try to guess it."
  );

  //Get the min value as an int
  console.log("Please enter the lower limit: ");
  minNumber = await getNumber();

  //Get the max value as an int
  console.log("Please enter the upper limit: ");
  maxNumber = await getNumber();

  //Get the secret number but make sure it's between the min and max
  console.log("What is your secret number?\nI won't peek, I promise...");
  let secretNumber = await getNumber();
  while (secretNumber < minNumber || secretNumber > maxNumber) {
    console.log(
      "I'm sorry, please choose a number between your lower and upper limits: "
    );
    secretNumber = await getNumber();
  }

  console.log(`You entered: ${secretNumber}`); //I like this way!

  let guess = Math.floor((maxNumber + minNumber) / 2); //The first guess should be in the middle of the range

  while (!gotIt) {
    if (
      !allGuesses.includes(guess) &&
      guess <= maxNumber &&
      guess >= minNumber &&
      lastGuess != secretNumber
    ) {
      let yesNo = await ask("Is your number " + guess + "? (Y/N)\n");
      allGuesses.push(guess);
      lastGuess = guess;
      if (yesNo.toLowerCase().startsWith("y")) {
        if (lastGuess != secretNumber) {
          console.log(
            "I think you're lying...\nI don't like playing with liars.\nGoodbye."
          );
          break;
        }
        gotIt = true;
        console.log("\nYour number was " + guess + ". That was easy!");
        console.log("Number of guesses: " + tries);
        console.log("My guesses were: " + allGuesses);
      } else {
        //currently covers "n" and all non yes responses
        tries++;
        let highLow = await ask("Is it higher (H), or lower (L)?\n");
        if (highLow.toLowerCase().startsWith("h")) {
          minNumber = guess;
          guess = guess + Math.ceil((maxNumber - minNumber) / 2);
          lastHighLow = "higher";
        } else {
          maxNumber = guess;
          guess = guess - Math.ceil((maxNumber - minNumber) / 2);
          lastHighLow = "lower";
        }
      }
    } else if (lastGuess == secretNumber) {
      console.log(
        "Wait a minute. I already guessed " +
          lastGuess +
          ". Isn't your number " +
          secretNumber +
          "?"
      );
      process.exit();
    } else if (guess >= maxNumber) {
      console.log(
        "I want to guess " +
          guess +
          " but you said it was lower than " +
          maxNumber +
          "."
      );
      process.exit();
    } else if (guess <= minNumber) {
      console.log(
        "I want to guess " +
          guess +
          " but you said it was higher than " +
          minNumber +
          "."
      );
      process.exit();
    } else if (lastGuess.includes(guess)) {
      console.log(
        "I want to guess " +
          guess +
          " but I've already guessed " +
          lastGuess +
          "!"
      );
      process.exit();
    } else {
      console.log("Hmmm... something went wrong. \nI'm going to exit.");
      process.exit();
    }
  }
  totalComputerTries += tries;
  totalComputerWins++;
  nextPlayer = "user";
  nextGame();
}

//The computer picks a number and the user guesses
async function userGuesses() {
  let userGuesses = [];
  let tries = 1;

  //let stringMin = await ask("What would you like the lower limit to be? ");
  //let min = parseInt(stringMin);
  //let stringMax = await ask("What would you like the upper limit to be? ");
  //let max = parseInt(stringMax);
  console.log("\nTell me the range you want and I'll pick a number.\n");
  
  //Get the min value as an int
  console.log("Please enter the lower limit: ");
  minNumber = await getNumber();

  //Get the max value as an int
  console.log("Please enter the upper limit: ");
  maxNumber = await getNumber();
  
  /*while (minNumber !== parseInt(minNumber)) {
    let stringMin = await ask("Type in the lower limit: ");
    minNumber = parseInt(stringMin);
    if (minNumber !== parseInt(minNumber)) {
      console.log("Please enter an integer value.");
    }
  }
  while (!(maxNumber === parseInt(maxNumber))) {
    let stringMax = await ask("Type in the upper limit: ");
    maxNumber = parseInt(stringMax);
    if (maxNumber !== parseInt(maxNumber)) {
      console.log("Please enter an integer value.");
    }
  }
  */
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
    } else if (!parseInt(guess)) {
      console.log("That wasn't a number! But I'm counting it as a guess.");
    } else {
      console.log("You got it!\nYour number of guesses: " + tries);
      console.log("Your guesses were: " + userGuesses);
      break;
    }
    tries++;
    guess = await ask("What's your guess? ");
  }
  totalUserTries += tries;
  totalUserWins++;
  nextPlayer = "computer";
  nextGame();
}

computerGuesses();
