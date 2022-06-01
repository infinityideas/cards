import { Component } from 'react';
import { Stage, Layer, Text} from 'react-konva';
import RegDeck from '../scripts/CardDict';
import HeaderText from '../components/HeaderText';
import React from 'react';
import UrlImage from '../components/crazyeights/UrlImage';
import config from '../scripts/Config';
import Pusher from "pusher-js";
import ShareButton from '../components/ShareButton';
import { Card } from '../scripts/Card';

const seed = [32, 10, 12, 2, 40, 49, 13, 9, 11, 0, 36, 23, 35, 38, 5, 14, 1, 20, 19, 33, 15, 3, 6, 43, 47, 44, 25, 22, 42, 50, 21, 37, 29, 31, 30, 4, 28, 8, 18, 46, 48, 16, 27, 51, 39, 7, 34, 26, 41, 17, 24, 45];

const axios = require('axios');
const backSrc = "https://infinitecards.s3.us-east-1.amazonaws.com/card_design_BBN3.png";

interface CrazyEightsState {
  loaded: boolean,
  rulesset: boolean,
  linkgiven: boolean,
  customLink: string,
  numConnected: number,
  gameId: string,
  currentPlayer: number,
  hands: any,
  index: number,
  reset: boolean
}

Pusher.logToConsole = true;
var pusher = new Pusher(config["pusherKey"], {
  cluster: 'us2'
});

class CrazyEights extends Component<{}, CrazyEightsState> {
  private cardDeck: Array<any>;
  private discardPile: Array<any>;
  private NUMPLAYERS: number;
  private numPlayersRef: any;
  private usernameRef: any;
  private channel: any;
  private userName: string;
  private userNameList: any;
  private computerNameList: any;
  private refDB: Array<any>;
  private posDB: Array<any>;

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      rulesset: false,
      linkgiven: false,
      customLink: "Loading link...",
      gameId: "",
      numConnected: 1,
      currentPlayer: 0,
      hands: [],
      index: 0,
      reset: false,
    }
    this.cardDeck = [];
    this.discardPile = [];
    this.NUMPLAYERS = 3;
    this.numPlayersRef = React.createRef();
    this.usernameRef = React.createRef();
    this.channel = "";
    this.userName = "";
    this.userNameList = {};
    this.computerNameList = [];
    this.refDB = [];
    this.posDB = [];

    this.setRules = this.setRules.bind(this);
    this.startLinkMonitor = this.startLinkMonitor.bind(this);
    this.computerJoined = this.computerJoined.bind(this);
    this.generatePlay = this.generatePlay.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  componentDidMount() {
    if (!this.state.loaded) {
      axios.get(config["flaskServer"]+"deckgen/regdecknj").then((response: any) => {
        this.cardDeck = []
        for (var i=0; i<response['data']['data'].length; i++) {
          this.cardDeck.push(RegDeck[seed[i]]);
        }
        console.log(this.cardDeck);
        this.setState({
          loaded: true
        })
      });
    }
  }

  computerJoined(data: any) {
    if (this.state.numConnected==this.NUMPLAYERS) {
      axios.post(config['flaskServer']+"publish", {
        GAME: this.state.gameId,
        MSG: "JOIN_RSP",
        PARAMS: {
          TO: data['FROM'],
          FROM: "SERVER",
          FAILURE: true
        }
      })
    } else {
      axios.post(config['flaskServer']+"publish", {
        GAME: this.state.gameId,
        MSG: "JOIN_RSP",
        PARAMS: {
          TO: data['FROM'],
          FROM: "SERVER",
          CARDS: [this.state.hands[this.state.numConnected][0],this.state.hands[this.state.numConnected][1],
          this.state.hands[this.state.numConnected][2],this.state.hands[this.state.numConnected][3],
          this.state.hands[this.state.numConnected][4],this.state.hands[this.state.numConnected][5],
          this.state.hands[this.state.numConnected][6]],
          ORDER: this.state.numConnected,
          FAILURE: false,
          NUMPLAYERS: this.NUMPLAYERS,
          DISCARD: this.discardPile[0].toDict()
        }
      }).then(()=> {
        this.userNameList[data['FROM']]=data['USERNAME'];
        this.computerNameList.push(data['FROM']);
        if (this.state.numConnected+1 == this.NUMPLAYERS) {
          axios.post(config['flaskServer']+"publish", {
            GAME: this.state.gameId,
            MSG: "WELCOME",
            PARAMS: {

            }
          }).then(() => {
            this.setState((prev: any) => {
              return ({
                numConnected: prev.numConnected+1,
                linkgiven: true
              })
            })
          })
        } else {
          this.setState((prev: any) => {
            return ({
              numConnected: prev.numConnected+1
            })
          })
        }
      })
    }
  }

  startLinkMonitor() {
    if (this.state.customLink=="Loading link...") {
      axios.get(config["flaskServer"]+"accessidgen").then((response: any) => {
        this.channel = pusher.subscribe(response['data']['data']);
        this.channel.bind("JOIN", this.computerJoined);
        this.setState({
          customLink: config['webServer']+"play/crazyeights/"+response['data']['data'],
          gameId: response['data']['data']
        });
      })
    }
  }

  setRules() {
    if (this.numPlayersRef.current.value < 2 || this.numPlayersRef.current.value > 4 || !this.numPlayersRef.current.value) {
      alert("You can only have between 2 and 4 players, inclusive!");
    } else {
      this.NUMPLAYERS = this.numPlayersRef.current.value;
      var currentHands: any = [];
      for (var player = 0; player<this.NUMPLAYERS; player++) {
        currentHands.push([]);
        for (var card = 0; card<7; card++) {
          currentHands[player].push((this.cardDeck.shift()).toDict());
        }
      }
      this.discardPile.push(this.cardDeck.shift());
      console.log(currentHands);
      this.userName = this.usernameRef.current.value;
      this.userNameList['SERVER']=this.userName+" (Host)";
      this.computerNameList.push('SERVER');
      this.setState({
        loaded: true,
        rulesset: true,
        linkgiven: false,
        hands: currentHands
      });
    }
  }

  dragEnd(current: any) {
    var currentList = [];
    for (var i=0; i<this.state.hands[0].length; i++) {
      currentList.push(this.state.hands[0][i].toString);
    }
    const index = currentList.indexOf(current.toString);
    console.log(currentList);
    console.log(current);
    console.log(index);
    console.log(this.state.hands);
    var newHand = [];
    for (var x=0; x<this.state.hands[0].length; x++) {
      if (x != index) {
        newHand.push(this.state.hands[0][x]);
      }
    }
    console.log(newHand);

    var toUpdate = this.state.hands.slice();
    toUpdate[0] = newHand;
    this.discardPile[0] = current;
    console.log(this.discardPile);
    console.log(this.state.hands);
    axios.post(config['flaskServer']+"publish", {
      GAME: this.state.gameId,
      MSG: "CARDDOWN",
      PARAMS: {
        TO: "ALL",
        FROM: "SERVER",
        FROMORDER: 0,
        NUMCARDS: this.state.hands[0].length-1,
        CARDDOWN: current,
        NEXTPLAYER: 1
      }
    }).then(() => {
      this.setState({
        currentPlayer: 1,
        hands: toUpdate.slice(),
        index: index,
        reset: true
      });
    })
  }

  componentDidUpdate() {
    if (!this.state.linkgiven) {
      return;
    }
    alert("HEY 1");
    if (this.state.reset) {
      this.setState({
        reset: false
      });
    }
  }

  generatePlay() {
    alert("hi");
    console.log(this.state);
    console.log(this.state.hands);
    var locationsX = [(window.innerHeight*1.5)/2-Math.floor(this.state.hands[0].length/2)*20-40, window.innerHeight*1.5-54, (window.innerHeight*1.5)/2-Math.floor(this.state.hands[0].length/2)*20-40, 0];
    var locationsY = [window.innerHeight-174, (window.innerHeight/2)-Math.floor(this.state.hands[1].length/2)*20-40, 0, (window.innerHeight/2)-Math.floor(this.state.hands[1].length/2)*20+40];

    var changeX = [true, false, true, false];
    var changeY = [false, true, false, true];

    var imageDB: Array<any> = [[]];
    this.posDB = [];
    this.refDB = [];
    var currentX = 0;
    var currentY = 0;
    console.log(this.discardPile[0].image);

    for (var i=0; i<this.state.hands.length; i++) {
      currentX = locationsX[i];
      currentY = locationsY[i];
      imageDB.push([]);
      this.refDB.push([]);
      this.posDB.push([]);

      for (var x=0; x<this.state.hands[i].length; x++) {
        if (i>0) {
          if (i==1) {
            console.log("1");
            console.log(currentX + " " + currentY);
            imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={90}/>);
          } else if (i==3) {
            console.log("2");
            console.log(currentX + " " + currentY);
            imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={-90}/>);
          } else {
            console.log("3");
            console.log(currentX + " " + currentY);
            imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={0}/>);
          }
          if (changeX[i]) {
            currentX += 20;
          }
          if (changeY[i]) {
            currentY += 20;
          }
        } else {
          console.log("0");
          console.log(currentX + " " + currentY);
          console.log(this.state.hands[0][x]);
          if (this.state.hands[0][x].denomination!= "none") {
            this.refDB[i].push(React.createRef());
            this.posDB[i].push([currentX, currentY]);
            imageDB[i+1].push(<UrlImage 
              src={this.state.hands[0][x].image} 
              x={currentX} 
              y={currentY} 
              width={this.state.hands[0][x].denomination == "none" ? 0 : 120} 
              height={174} 
              draggable={this.state.currentPlayer == 0 ? true : false} 
              rot={0} 
              discardX={window.innerHeight*1.5/2+5} 
              discardY={window.innerHeight/2-87}
              discard={this.discardPile[0]}  
              current={this.state.hands[0][x]}
              cursor={this.state.currentPlayer == 0 ? "grab" : "not-allowed"}
              dragEnd = {this.dragEnd}
              target = {this.refDB[i][x]}
            />);
          }
          if (this.state.hands[0][x].denomination != "none") {
            currentX += 20;
          }
        }
      }
    }
    console.log(imageDB);

    imageDB[0].push(<UrlImage width={120} height={174} src={backSrc} x={window.innerHeight*1.5/2-125} y={window.innerHeight/2-87} draggable={false} rot={0}/>);
    imageDB[0].push(<UrlImage width={120} height={174} src={this.discardPile[0].image} x={window.innerHeight*1.5/2+5} y={window.innerHeight/2-87} draggable={false} rot={0} />);

    var layerDB = [];
    for (var z=0; z<imageDB.length; z++) {
      layerDB.push(<Layer>{imageDB[z]}</Layer>);
    }

    return (<Stage width={window.innerHeight*1.5} height={window.innerHeight}>
      {layerDB}
    </Stage>)
    
  }

  render() {
    if (!this.state.loaded) {
      return (
        <div>Loading</div>
      )
    }
    if (!this.state.rulesset) {
      return (
        <div>
          <HeaderText innerText="Crazy Eights" subText={<p>Set the rules for the game here.</p>}/>
          <div style={{textAlign: "center"}}>
            <label htmlFor='numplayers' style={{paddingRight: 10}}>How many Players?</label>
            <input type="number" name="numplayers" ref={this.numPlayersRef} /><br/>
            <label htmlFor='username' style={{paddingRight: 10}}>What is your username?</label>
            <input type="text" name="username" ref={this.usernameRef} /><br/><br/>
            <button onClick={this.setRules}>Set Rules</button>
          </div>
        </div>
      )
    }
    if (!this.state.linkgiven) {
      this.startLinkMonitor();
      var subtext = (<p>
        Awesome! Now share this link with your friends.
        <br/>The game won't start until all {this.NUMPLAYERS} players join.
        <br/><br/><strong style={{fontFamily: "LatoBold"}}>{this.state.customLink}</strong><br/>
        <ShareButton innerText="Share" shareText={this.state.customLink} backgroundColor="#2dd121"/><br/>
        There are {this.state.numConnected}/{this.NUMPLAYERS} players connected.</p>);
      return (
        <div>
          <HeaderText innerText='Crazy Eights' subText={subtext} />
        </div>
      )
    }
    if (this.state.reset) {
      return (
        <div></div>
      )
    }
    var currentLayer = this.generatePlay();
    return (
      <div>
      {currentLayer}
      </div>
    );
  }
}

export default CrazyEights;