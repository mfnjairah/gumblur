import React, { useState, useEffect } from "react";
import "./Card.css";

function Card() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (deck.length > 0) {
      setPlayerHand([drawCard(), drawCard()]);
      setDealerHand([drawCard(), drawCard()]);
    }
  }, [deck]);

  const startGame = () => {
    const newDeck = createDeck();
    setDeck(shuffle(newDeck));
    setGameOver(false);
  };

  const createDeck = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    let deck = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }

    return deck;
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const drawCard = () => deck.pop();

  const calculateHandValue = (hand) => {
    let sum = 0;
    let hasAce = false;

    for (let card of hand) {
      if (card && card.value === "A") {
        hasAce = true;
      }
      if (card) {
        sum += getValue(card.value);
      }
    }

    if (hasAce && sum + 10 <= 21) {
      sum += 10;
    }

    return sum;
  };

  const getValue = (cardValue) => {
    if (cardValue === "K" || cardValue === "Q" || cardValue === "J") {
      return 10;
    } else if (cardValue === "A") {
      return 1;
    } else {
      return parseInt(cardValue, 10);
    }
  };

  const playerHit = () => {
    setPlayerHand((prevHand) => [...prevHand, drawCard()]);

    if (calculateHandValue(playerHand) > 21) {
      setGameOver(true);
    }
  };

  const playerStand = () => {
    let updatedDealerHand = [...dealerHand];

    while (calculateHandValue(updatedDealerHand) < 17) {
      updatedDealerHand.push(drawCard());
    }

    setDealerHand(updatedDealerHand);
    setGameOver(true);
  };

  const determineWinner = () => {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    if (playerScore > 21) {
      return "You busted! Dealer wins.";
    } else if (dealerScore > 21) {
      return "Dealer busted! You win.";
    } else if (playerScore > dealerScore) {
      return "You win!";
    } else if (dealerScore > playerScore) {
      return "Dealer wins.";
    } else {
      return "It's a tie!";
    }
  };

  const updateUI = () => {
    if (gameOver) {
      return (
        <div>
          <p>{determineWinner()}</p>
          <button onClick={startGame}>New Game</button>
        </div>
      );
    }

    if (deck.length > 0) {
      return (
        <div>
          <p>Player Score: {calculateHandValue(playerHand)}</p>
          <p>Dealer Score: {calculateHandValue(dealerHand)}</p>
          {playerHand.map((card, index) => (
            <div key={index} className="card">
              {card && card.value
                ? `${card.value} of ${card.suit}`
                : "Card not available"}
            </div>
          ))}

          <div>
            <button onClick={playerHit}>Hit</button>
            <button onClick={playerStand}>Stand</button>
          </div>
        </div>
      );
    }

    return null; // or loading indicator if needed
  };

  return (
    <div className="App">
      <h1>Blackjack Game</h1>
      <div id="game-container">{updateUI()}</div>
      <p>Copyright © 2023 Jairah Tech Solutions</p>
    </div>
  );
}

export default Card;
