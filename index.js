/*Limitation: Right now the program only checks for Y and H and assumes if it
isn't either of those then it's N and L. Add a conditon to check for
N and L then add what to do if a user adds something else */

//Question: How do you loop the ask until a correct answer is given? It can receive strings --> NaN
//Question: let guess = Math.floor((+max + +min)/2); On line 37. Why does this get coerced to a string?

/*To Do: Add a cheat detector - keep track of the numbers that can't be right and compare the guess to that range
Note that lastGuess and highLow are scoped inside an if statement and current can't be used in the last else*/
//Other: secretNumber isn't currently used - not sure it's needed if we're asking for a Y/N

//Bug: If you pick the highest number and lie when it gets guessed, the program will guess a lower number once

const readline = require("readline");
const readlineInterface = readline.createInterface(process.stdin,  process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

start();

async function start() {
  
  let gotIt = false;
  let tries = 1;
  let lastGuess = null;

 
  console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.");
  let min = await ask("Type in the lower limit: " );
  let max = await ask("Type in the upper limit: " );
  let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  console.log('You entered: ' + secretNumber); //Currently not used
  let guess = Math.floor((+max + +min)/2); //Why does this get coerced to a string?


  while (!gotIt) {
    if (lastGuess != guess) {
      let yesNo = await ask("Is your number " + guess + "? (Y/N)\n");
      if (yesNo.toLowerCase().startsWith("y")) {
        gotIt = true;
        console.log("Your number was " + guess + ". That was easy!");
        console.log("I guessed it in " + tries + " tries.");
      } else {
        tries++;
        lastGuess = guess;
        let highLow = await ask("Is it higher (H), or lower (L)?\n");
        if (highLow.toLowerCase().startsWith("h")) {
          min = guess;
          guess = guess + Math.ceil((max - min) / 2);
        } else {
          max = guess;
          guess = guess - Math.ceil((max - min) / 2);
        }
      }
    } else {
      console.log("Hmmm... I don't like playing with liars. \nI'm going to exit.");
      process.exit();
    }
  }
  process.exit();
}









