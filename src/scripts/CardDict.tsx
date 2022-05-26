import { Card } from "./Card";

let RegDeck: Array<any> = [];
const denominations = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
const suits = ["clubs", "diamonds", "hearts", "spades"];
const denoNames = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"];
const suitNames = ["Clubs", "Diamonds", "Hearts", "Spades"];
const values = [2,3,4,5,6,7,8,9,10,11,12,13,14]

for (var denomination=0; denomination<13; denomination++) {
    for (var suit=0; suit<4; suit++) {
        RegDeck.push(new Card(denoNames[denomination], suitNames[suit], import("../assets/images/cards/regdeck/"+denominations[denomination]+"_of_"+suits[suit]+(denomination>8 && denomination<12 ? "2" : "")+".png"), (suits[suit]=="diamonds" || suits[suit]=="hearts" ? "Red" : "Black"), values[denomination]))
    }
}

RegDeck.push(new Card("Joker", "N", import('../assets/images/cards/regdeck/red_joker.png'), "Red", 0));
RegDeck.push(new Card("Joker", "N", import('../assets/images/cards/regdeck/black_joker.png'), "Black", 0));

export default RegDeck;