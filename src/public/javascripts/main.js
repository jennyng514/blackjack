
let deck = new Array();
let players = [
    {
        points: 0,
        hand: new Array(),
    },
    {
        points: 0,
        hand: new Array(),
    }
];
let suits = ["D", "C", "H", "S"];
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let winner = false;

function generateDeck (startValues) {
    let topOfDeck = new Array();
    let restOfDeck = new Array();
    for (let i = 0; i < startValues.length; i++) {
        let suitIndex;
        if (i > 3) {
            suitIndex = getRandomIntInclusive(0, 3)
        }
        else {
            suitIndex = i; 
        }
        let card = {value: startValues[i], suit: suits[suitIndex]};
        topOfDeck.push(card);
    }
    
    for(let i = 0; i < suits.length; i++) {
		for(let j = 0; j < values.length; j++) {
            let card = {value: values[j], suit: suits[i]};
            restOfDeck.push(card);
        }
    }

    shuffle(restOfDeck);

    if (startValues[0] == "") {
        deck = restOfDeck;
        deck = deck.filter((value,index,deck)=>deck.findIndex(card => (card.value === value.value && card.suit === value.suit)) === index);
    }
    else {
        deck = topOfDeck.concat(restOfDeck);
        deck = deck.filter((value,index,deck)=>deck.findIndex(card => (card.value === value.value && card.suit === value.suit)) === index);
    }
}

function shuffle (deck) {   
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function displayCards () {  
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < players[i].hand.length; j++) {
            if (i === 0) {
                let card = players[0].hand[j];
                let img = document.createElement('img');
                if (card.value == "A" && card.suit == "D") {
                    img.src = 'img/' + card.suit + card.value + ".png";
                }
                else {
                    img.src = 'img/' + card.value + card.suit + ".png";
                }
                img.style.width = "125px";
                img.style.height = "185px";               
                document.getElementById("userCards").appendChild(img);
            }
            else if (i === 1) {
                let card = players[1].hand[j];
                let img = document.createElement('img');
                if (j > 0 && !winner) {
                    img.src = 'img/blue_back.png';
                }
                else if (card.value == "A" && card.suit == "D") {
                    img.src = 'img/' + card.suit + card.value + ".png";
                }
                else {
                    img.src = 'img/' + card.value + card.suit + ".png";
                } 
                img.style.width = "125px";
                img.style.height = "185px";             
                document.getElementById("computerCards").appendChild(img);
            }
        }
    }  
}

function getRandomIntInclusive (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function resetHand () {
    document.getElementById("userCards").innerHTML = "";
    document.getElementById("computerCards").innerHTML = "";
    calculateScore();  
    displayCards(); 
}

function calculateScore () {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (players[j].points > 21) {
                winner = true;
                document.getElementById("buttons").style.display = "none";
                if (j === 0) {
                    if (resultText.hasChildNodes()) {
                        resultText.replaceChild(document.createTextNode("Computer won! (Player bust)"),resultText.firstChild);
                    }
                    else {
                        resultText.appendChild(document.createTextNode("Computer won! (Player bust)!"));
                    }
                    
                } 
                else { 
                    if (resultText.hasChildNodes()) {
                        resultText.replaceChild(document.createTextNode("Player won! (Computer bust)"),resultText.firstChild);
                    }
                    else {
                        resultText.appendChild(document.createTextNode("Player won! (Computer bust)"));
                    }
                }
            }
        }

        let score = 0;   
        for (let k = 0; k < players[i].hand.length; k++) {
            if (players[i].hand[k].value === "A") {
                if (score + 10 <= 21) {
                    score += 11;
                }
                else {
                    score += 1;
                }
            }
            else if (players[i].hand[k].value === "J" || players[i].hand[k].value === "Q" || players[i].hand[k].value === "K") {
                score += 10;
            }
            else {
                score += parseInt(players[i].hand[k].value);
            }  
        }
        players[i].points = score; 
    }

    userScore.replaceChild(document.createTextNode("User Score - " + players[0].points), userScore.firstChild);
    if (winner) {
        computerScore.replaceChild(document.createTextNode("Computer Score - " + players[1].points), computerScore.firstChild);
    }
    else {
        computerScore.replaceChild(document.createTextNode("Computer Score - ?"), computerScore.firstChild);
    }
}

function main() {
    document.querySelector('.playBtn').addEventListener('click', function(event) {
        event.preventDefault();
        const form = document.querySelector(".start");
        form.style.display = "none";
        const startValues = document.querySelector("#startValues").value.split(',');

        generateDeck(startValues);

        players[0].hand.push(deck.shift());
        players[1].hand.push(deck.shift());
        players[0].hand.push(deck.shift());
        players[1].hand.push(deck.shift());

        const gameDiv = document.querySelector(".game");

        const userDiv = document.createElement("div");
        userDiv.setAttribute("id", "userDiv");
        const userScore = document.createElement("h1");	
        userScore.setAttribute("id", "userScore");
        const userCards = document.createElement("div");
        userCards.setAttribute("id", "userCards");
        userDiv.appendChild(userScore);
        userScore.appendChild(document.createTextNode("User Score - " + players[0].points));
        userDiv.appendChild(userCards);
        gameDiv.appendChild(userDiv);

        const computerDiv = document.createElement("div");
        computerDiv.setAttribute("id", "computerDiv");
        const computerScore = document.createElement("h1");	
        computerScore.setAttribute("id", "computerScore");
        const computerCards = document.createElement("div");
        computerCards.setAttribute("id", "computerCards");
        computerDiv.appendChild(computerScore);
        computerScore.appendChild(document.createTextNode("Computer Score - ?" ));
        computerDiv.appendChild(computerCards);
        gameDiv.appendChild(computerDiv);

        const hit = document.createElement("button");
        hit.setAttribute("id", "hit");
        hit.appendChild(document.createTextNode("HIT"));

        const stand = document.createElement("button");
        stand.setAttribute("id", "stand");
        stand.appendChild(document.createTextNode("STAND"));

        const buttons = document.createElement("div");
        buttons.setAttribute("id", "buttons");
        buttons.appendChild(hit);
        buttons.appendChild(stand);
        gameDiv.appendChild(buttons);

        const results = document.createElement("div");
        const resultText = document.createElement("h1");	
        resultText.setAttribute("id", "resultText");
        results.appendChild(resultText);
        gameDiv.appendChild(results);
    
        resetHand();

        hit.addEventListener("click", function () {    
            const card = deck.shift();
            players[0].hand.push(card);
            resetHand(); 
        });
        stand.addEventListener("click", function () {    
            while (!winner) {
                let rule = getRandomIntInclusive(16, 20);
                if (players[1].points < rule) {
                    const card = deck.shift();
                    players[1].hand.push(card);
                    resetHand();
                }
                else {
                    winner = true;
                    document.getElementById("buttons").style.display = "none";
                }
            }
            if (players[0].points === players[1].points) {   
                if(players[0].points === 21 && players[1].points === 21 ) {
                    if(players[0].hand.length < players[1].hand.length) {
                        if (resultText.hasChildNodes()) {
                            resultText.replaceChild(document.createTextNode("Player won!"),resultText.firstChild);
                        }
                        else {
                            resultText.appendChild(document.createTextNode("Player won!"));
                        }                         
                    }
                    else if (players[0].hand.length > players[1].hand.length) {
                        if (resultText.hasChildNodes()) {
                            resultText.replaceChild(document.createTextNode("Computer won!"),resultText.firstChild);
                        }
                        else {
                            resultText.appendChild(document.createTextNode("Computer won!"));
                        }                           
                    }
                    else {
                        if (resultText.hasChildNodes()) {
                            resultText.replaceChild(document.createTextNode("Tie!"),resultText.firstChild);
                        }
                        else {
                            resultText.appendChild(document.createTextNode("Tie!"));
                        }                        
                    }
                }  
                else {
                    if (resultText.hasChildNodes()) {
                        resultText.replaceChild(document.createTextNode("Tie!"),resultText.firstChild);
                    }
                    else {
                        resultText.appendChild(document.createTextNode("Tie!"));
                    }
                }                          
            }
            else if (players[0].points > players[1].points) {
                if (resultText.hasChildNodes()) {
                    resultText.replaceChild(document.createTextNode("Player won!"),resultText.firstChild);
                }
                else {
                    resultText.appendChild(document.createTextNode("Player won!"));
                } 
            } 
            else {          
                if (resultText.hasChildNodes()) {
                    resultText.replaceChild(document.createTextNode("Computer won!"),resultText.firstChild);
                }
                else {
                    resultText.appendChild(document.createTextNode("Computer won!"));
                }                
            }
            resetHand();
        });
    });       
}

document.addEventListener('DOMContentLoaded', main);