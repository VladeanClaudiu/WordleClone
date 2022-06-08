document.addEventListener("DOMContentLoaded", () => {
  //calling function that creates the squares
  wordSquares();

  //array of guessed words every word is an array of letters, when a new word is added a new array is created in the array
  let guessedWords = [[]];

  let spaceAvailable = 1;

  let wordArray = [];
  let testWord;
  fetch("words2.json")
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      wordArray = data;
    })
    .then(() => {
      //console.log(wordArray);
      testWord = wordArray[Math.floor(Math.random() * wordArray.length)];
      console.log(testWord);
    });

  let guessedWordCount = 0;

  //array assigned the value of all the key button ids
  const keys = document.querySelectorAll(".key-row button");

  //function that returns the number of guessed words so far
  function getCurrentWordArr() {
    //number of guessed words in the array
    const numberOfGuesses = guessedWords.length;
    //returns the current array thats being updated
    return guessedWords[numberOfGuesses - 1];
  }

  //function that adds to the guesses array takes in a letter input
  function updateGuesses(letter) {
    //assings a current array variable a function value
    const currentWordArr = getCurrentWordArr();

    //if statemtent that checks if currentWordArr exists and if the array word has less that 5 characters
    if (currentWordArr && currentWordArr.length < 5) {
      //push a letter to the current internal array of guessed words
      currentWordArr.push(letter);

      const spaceAvailableEl = document.getElementById(String(spaceAvailable));
      spaceAvailable = spaceAvailable + 1;

      spaceAvailableEl.textContent = letter;
    }
  }

  function getTileColour(letter, index) {
    //variable used to check if the guessed word contains letter from the testWord, boolean value is returned
    const correctLetter = testWord.includes(letter);

    //if fasle and letter is not present in the test word
    if (!correctLetter) {
      //returns gray value
      return "#3a3a3c";
    }
    //cosnt that checks if the test word matches the letter to the word square index
    const letterPosssitionTrue = testWord.charAt(index);
    //sets a true of false value if the possion letter matches
    const isTrue = letter === letterPosssitionTrue;
    //if the letter is in the right place
    if (isTrue) {
      //returns green value
      return "#6aaa64";
    }
    //returns yellow valye
    return "#b59f3b";
  }

  //handle submit function
  function handleSumbitWord() {
    const currentWordArr = getCurrentWordArr();

    //if the current word array is not 5 letter long alert
    if (currentWordArr.length != 5) {
      window.alert("Word is not 5 letter");
      console.log(guessedWords);
    }
    //joins all the letters in the innner array
    const currentWord = currentWordArr.join("");

    //assigning the full word array to a varriable
    const wordArrayChecker = wordArray;
    //checking if the array assignment works
    //console.log(wordArrayChecker) ;

    //if statement that checks if the full word array includes the sumbitted word
    if (wordArrayChecker.includes(currentWord)) {
      //the id of the first letter in a word being typed
      const firstLetterId = guessedWordCount * 5 + 1;
      //interval const varaible
      const interval = 300;

      //an interval for each tile that sets a new color for the tile
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          //const set to function that assigns appropriate colors to the tiles based on the letter possitions or presence in the word
          const colorTile = getTileColour(letter, index);
          //gets the letter id for each specific letter in the word - all tiles have a uniue number id
          const letterId = firstLetterId + index;
          //get elememnt variable
          const letterElement = document.getElementById(letterId);
          //adding a class to the squares that animate the letters
          letterElement.classList.add("animate__flipInX");
          //styling the squares when letters are submitted
          letterElement.style = `background-color:${colorTile}; border-color:${colorTile}`;
          //multiply the interval by the index of the item in the array adding a delay to each letter
        }, interval * index);
      });
      console.log("present");
      guessedWordCount += 1;

      //checks if the joined letter match the word
      if (currentWord === testWord) {
        if (guessedWords.length === 1) {
          window.alert("Well done you lucky nerd");
        }
        if (guessedWords.length === 6) {
          window.alert("Cutting it close my guy");
        }
      }
      //checks if the length of the guess array is 6
      if (guessedWords.length === 7) {
        window.alert(`The word is ${testWord}`);
      }
      //pushes a new array inside the guessed words array
      guessedWords.push([]);
    } else {
      window.alert("Word does not exist");
    }
  }

  //function that handles letter deletion
  function handleDelete() {
    //current word array that contains the letters before they are submited as a word
    const currentWordArr = getCurrentWordArr();
    //remove letters remove the last element of the array using .pop()
    const removeLetter = currentWordArr.pop();

    //gets the last letter in the array
    guessedWords[guessedWords.length - 1] = currentWordArr;

    //grabs the id of the last letter in the square div
    const lastWordLetterEl = document.getElementById(
      String(spaceAvailable - 1)
    );

    //changes the value of the array to empty
    lastWordLetterEl.textContent = " ";
    //changes the value of space available assigned to the id div of the word squares
    spaceAvailable = spaceAvailable - 1;
  }

  //creating the squares for the board
  function wordSquares() {
    //assigns the id to a constant variable
    const wordleBoard = document.getElementById("board");

    //for loop is ran 30 times because thre are 6 words needed all 5 letters
    for (let i = 0; i < 30; i++) {
      //varriable div is created
      let square = document.createElement("div");
      //adds a calss to the variables with the classname square
      square.classList.add("square");
      square.classList.add("animate__animated");
      //assigns a numeric id value to the div
      square.setAttribute("id", i + 1);
      //appends the new div to the board div
      wordleBoard.appendChild(square);
    }
  }

  //for loop that logs through all the pressed keys when a on click happens and gets data-key value of the button
  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");
      //console.log(letter);
      //trigger handleSumbitWord if the enter key is pressed
      if (letter === "enter") {
        handleSumbitWord();
        return;
      }
      //
      if (letter === "del") {
        handleDelete();
        return;
      }
      // updating the letter input to the array from the datakey value using the function call below
      updateGuesses(letter);
    };
  }
});
