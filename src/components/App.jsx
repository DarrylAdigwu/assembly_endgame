import { useState } from 'react'
import { languages } from '../languages'
import { clsx } from 'clsx'
import { getStatusText, getRandomWord } from '../utils'

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values and expressions
  const wrongGuessCount = guessedLetters.filter(guess => !currentWord.includes(guess))
  const gameLost = wrongGuessCount.length === 8;
  const gameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const gameOver = gameWon || gameLost
  const currentGuess = guessedLetters[guessedLetters.length - 1]
  const lastWrongGuess = !currentWord.includes(currentGuess)
  const lastCorrectGuess = currentWord.includes(currentGuess)
  const numGuessesLeft = languages.length - 1
  // Create language chips
  const languageList = languages.map((language, index) => {

    // Checks wrong guesses to change language chips
    const eliminated = wrongGuessCount.length > index ? "0.1" : "1"
    
    const styles = {
      backgroundColor: `${language.backgroundColor}`,
      color: `${language.color}`,
      opacity: `${eliminated}`
    }

    return (
      <span key={index} style={styles}>
        {language.name}
      </span>
    )
  })


  // Displaying word on page
  const letterElements = currentWord.split("").map((letter, index) => {

    const correctGuess = guessedLetters.filter(guess => currentWord.includes(guess))
    
    return (
      <span key={index}>
        {correctGuess.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    )
  })

  // Show missed letters
  const missedLetters = currentWord.split("").map((letter, index) => {
    if(!guessedLetters.includes(letter)) {
        return(
          <span key={index} style={{color: "#EC5D49"}}>
              {letter.toUpperCase()}
          </span>
        )
          
    } else if(guessedLetters.includes(letter)) {
        return (
          <span key={index}>
              {letter.toUpperCase()}
          </span>
        )
    }
})
  
  // Keyboard Element
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  const keyElements = alphabet.split("").map(letter => {
    const isWrong = !currentWord.includes(letter) && guessedLetters.includes(letter)
    const isCorrect = currentWord.includes(letter) && guessedLetters.includes(letter)


  const keyColors = clsx({
    wrong: isWrong,
    right: isCorrect
  })

    return (
      <span key={letter} onClick={() => addGuess(letter)} className={`${keyColors} keyLetters`}>
        {letter.toUpperCase()}
      </span>
    )
  })

  // Adding keyboard inputs into guessedLetters
  function addGuess(letter) {
    setGuessedLetters(prevLetters => {    
      return (
          prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
      )
    })
  }

  // Get dynamic status messages
  const statusClassName = clsx("status", {
    notice: !gameOver && lastWrongGuess && wrongGuessCount.length > 0,
    correct: gameWon,
    incorrect: gameLost
  })


  function status() {
    if(!gameOver && lastWrongGuess && wrongGuessCount.length > 0) {
      return(
        <p>
          {getStatusText(languages[wrongGuessCount.length - 1].name)}
        </p>
      )
    }
    if(gameWon){
      return (
        <>
          <h2>You Won!</h2>
          <p>Well done!</p>
        </>
        )
      }

    if(gameLost){
      return ( 
        <>
          <h2>Game Over!</h2>
          <p>You better start learning Assembly</p>
        </>
      )
    }
  }

  // Start new game
  function newGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }
  
  return (
    <main>
        <section className="message-container">
          <div className="headline">
            <h1>Assembly: Endgame</h1>
            <p>
              Guess the word in under 8 attempts to keep the
              programming world safe from Assembly! 
            </p>
          </div>
          <div 
            className={statusClassName}
            aria-live="polite" 
            role="status"
          >
            {status()}
          </div>
        </section>
        <section className="languages">
          {languageList}
        </section>
        <section className="word">
        {gameOver ? missedLetters :  letterElements}
        </section>
        {/* Combined visually-hidden aria-live region for status updates */}
        <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(currentGuess) ? 
                        `Correct! The letter ${currentGuess} is in the word.` : 
                        `Sorry, the letter ${currentGuess} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>
        <section className="keyboard">
          {keyElements}
        </section>
        {gameOver ? <button className="new-game" onClick={() => newGame()}>
          New Game
        </button> : null}
    </main>
  )
}

export default App
