/*Limitation: Right now the program only checks for Y and H and assumes if it
isn't either of those then it's N and L. Add a conditon to check for
N and L then add what to do if a user adds something else */

//Updates: Added a while loop for input until a number is given

/*To Do: Add a cheat detector - keep track of the numbers that can't be right and compare the guess to that range
Possible solution: Use guess >= maxNumber and guess <= minNumber to check if the user is lying*/

//Bug: If you pick the highest or lowest number and lie when it gets guessed, the program will guess a different number once

/**********Boiler Plate Begin ************/
const readline = require("readline");
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/**********Boiler Plate End ************/

start(); //runs the start function to begin the game

async function start() {
  let gotIt = false; //tracks if the computer has correctly guessed the number
  let tries = 1; //If the computer doesn't guess correctly this value is incremented
  let lastGuess = []; //tracks guesses so they can't be repeated
  let minNumber = "inappropriate start value";
  let maxNumber = "inappropriate start value";
  let secretNumber = "inappropriate start value";

  console.log(
    "Let's play a game where you (human) make up a number and I (computer) try to guess it."
  );

  while (minNumber !== parseInt(minNumber)) {
    let minString = await ask("Type in the lower limit: ");
    minNumber = parseInt(minString);
  }

  while (!(maxNumber === parseInt(maxNumber))) {
    let maxString = await ask("Type in the upper limit: ");
    maxNumber = parseInt(maxString);
  }

  while (!(secretNumber === parseInt(secretNumber))) {
    let secretString = await ask("What is your secret number?\nI won't peek, I promise...\n");
    secretNumber = parseInt(secretString);
  }
    //let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  console.log("You entered: " + secretNumber);

  let guess = Math.floor((maxNumber + minNumber) / 2); //The first guess should be in the middle of the range

  while (!gotIt) {
    if (!lastGuess.includes(guess) && guess <= maxNumber && guess >= minNumber && lastGuess != secretNumber) {
      let yesNo = await ask("Is your number " + guess + "? (Y/N)\n");
      if (yesNo.toLowerCase().startsWith("y")) {
        gotIt = true;
        console.log("Your number was " + guess + ". That was easy!");
        console.log("I guessed it in " + tries + " tries.");
      } else { //currently covers "n" and all non yes responses
        tries++;
        lastGuess.push(guess);

        
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
       console.log("I want to guess " + guess + " but you said it was higher than " + maxNumber + ".");
       process.exit();
    } else if(guess <= minNumber){
       console.log("I want to guess " + guess + " but you said it was lower than " + minNumber + ".");
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
