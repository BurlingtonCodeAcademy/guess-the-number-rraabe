/*Limitation: Right now the program only checks for Y and H and assumes if it
isn't either of those then it's N and L. Add a conditon to check for
N and L then add what to do if a user adds something else */

//Update: Added a while loop for input until a number is given.
//Update: Pulled the lower limit, upper limit, and secret number code out into a single getNumber function.
//Update: Added a check that the secretNumber was between the lower and upper limits

/*To Do: Check if the cheat engine is working (check limits). Move the checks above the H/L code */

//(?)Bug: If you pick the highest or lowest number and lie when it gets guessed, the program will guess a different number once

/**********Boiler Plate Begin ************/
const readline = require("readline");
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/**********Boiler Plate End ************/

//This function gets an input from the user, checks to make sure its an number and stores it as an int
async function getNumber() {
  let inputNumber = "inappropriate start value";
  while (inputNumber !== parseInt(inputNumber)) {
    let inputString = await ask("");
    inputNumber = parseInt(inputString);
    if(inputNumber !== parseInt(inputNumber)){
      console.log("Please enter an integer: ");
    }
  }
  return inputNumber;
}

start(); //runs the start function to begin the game

async function start() {
  let gotIt = false; //tracks if the computer has correctly guessed the number
  let tries = 1; //If the computer doesn't guess correctly this value is incremented
  let allGuesses = []; //tracks guesses so they can't be repeated
  let lastGuess = null;

  console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.");

  //Get the min value as an int
  console.log("Please enter the lower limit: ");
  let minNumber = await getNumber(); 

  //Get the max value as an int
  console.log("Please enter the upper limit: ");
  let maxNumber = await getNumber();

  //Get the secret number but make sure it's between the min and max
  console.log("What is your secret number?\nI won't peek, I promise...");
  let secretNumber = await getNumber();
  while(secretNumber < minNumber || secretNumber > maxNumber){
    console.log("I'm sorry, please choose a number between your lower and upper limits: ");
    secretNumber = await getNumber();
  }

  console.log("You entered: " + secretNumber);

  let guess = Math.floor((maxNumber + minNumber) / 2); //The first guess should be in the middle of the range

  while (!gotIt) {
    if (!allGuesses.includes(guess) && guess <= maxNumber && guess >= minNumber && lastGuess != secretNumber) {
      let yesNo = await ask("Is your number " + guess + "? (Y/N)\n");
      allGuesses.push(guess);
      lastGuess = guess;
      if (yesNo.toLowerCase().startsWith("y")) {
        if(lastGuess != secretNumber){
          console.log("I think you're lying...\nI don't like playing with liars.\nGoodbye.");
          break;
        }
        gotIt = true;
        console.log("Your number was " + guess + ". That was easy!");
        console.log("Number of guesses: " + tries);
        console.log("My guesses were: " + allGuesses);
      } else { //currently covers "n" and all non yes responses
        tries++;
        let highLow = await ask("Is it higher (H), or lower (L)?\n");
        if (highLow.toLowerCase().startsWith("h")) {
          minNumber = guess;
          guess = guess + Math.ceil((maxNumber - minNumber) / 2);
          lastHighLow = 'higher';
        } else {
          maxNumber = guess;
          guess = guess - Math.ceil((maxNumber - minNumber) / 2);
          lastHighLow = "lower";
        }
      }
    } else if(lastGuess == secretNumber){
       console.log("Wait a minute. I already guessed "+ lastGuess + ". Isn't your number " + secretNumber + "?");
       process.exit();
    } else if(guess >= maxNumber){
       console.log("I want to guess " + guess + " but you said it was lower than " + maxNumber + ".");
       process.exit();
    } else if(guess <= minNumber){
       console.log("I want to guess " + guess + " but you said it was higher than " + minNumber + ".");
       process.exit();
    } else if(lastGuess.includes(guess)){
       console.log("I want to guess " + guess + " but I've already guessed "+ lastGuess + "!");
      process.exit();
    } else {
      console.log("Hmmm... something went wrong. \nI'm going to exit.");
      process.exit();
    }
  }
  process.exit();
}
