export class Card {
    public denomination: string;
    public suit: string;
    public image: any;
    public color: string;
    public value: number;

    constructor(de: string, suit: string, image: any, color: string, value: number) {
        this.denomination = de;
        this.suit = suit;
        this.image = image;
        this.color = color;
        this.value = value;
    }

    getDenomination() {return this.denomination;}
    getSuit() {return this.suit;}
    getImage() {return this.image;}
    getColor()  {return this.color;}
    getValue() {return this.value;}

    toString() {
        return this.denomination+" of "+this.suit;
    }

    toDict() {
        return {
            denomination: this.denomination,
            suit: this.suit,
            image: this.image,
            color: this.color,
            value: this.value
        }
    }

    isValid_CE(other: Card) {
        if (this.denomination == "eight" || other.getDenomination()==this.denomination || other.getSuit() == this.suit) {
            return true;
        } else {
            return false;
        }
    }
}