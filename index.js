let deckId
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeck = document.getElementById("new-deck")
const drawCards = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")

function handleClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
            console.log(deckId)
            computerScore = 0
            myScore = 0
            computerScoreEl.textContent = `Computer Score: ${computerScore}`
            myScoreEl.textContent = `My Score: ${myScore}`
            header.textContent = "Game of War"
            drawCards.disabled = false
            cardsContainer.innerHTML = `
                <div class="card-slot"></div>
                <div class="card-slot"></div>
            `
    })
}

newDeck.addEventListener("click", handleClick)

drawCards.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = theWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText

            if (data.remaining === 0) {
                drawCards.disabled = true
                if (computerScore > myScore) {
                    header.textContent = "Computer won the game!"
                } else if (myScore > computerScore) {
                    header.textContent = "You won the game!"
                } else {
                    header.textContent = "It's a tie!"
                }
            }
        })
})

function theWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)

    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `Computer Score: ${computerScore}`
        return "Computer wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++
        myScoreEl.textContent = `My Score: ${myScore}`
        return "Player wins!"
    } else {
        return "War!"
    }
}