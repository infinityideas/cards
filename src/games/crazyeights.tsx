import { Component } from 'react';
import { Stage, Layer} from 'react-konva';
import RegDeck from '../scripts/CardDict';
import HeaderText from '../components/HeaderText';
import React from 'react';
import UrlImage from '../components/UrlImage';
import config from '../scripts/Config';
import Pusher from "pusher-js";
import ShareButton from '../components/ShareButton';

const axios = require('axios');

interface CrazyEightsState {
  loaded: boolean,
  rulesset: boolean,
  linkgiven: boolean,
  customLink: string,
  numConnected: number,
  gameId: string
}

Pusher.logToConsole = true;
var pusher = new Pusher(config["pusherKey"], {
  cluster: 'us2'
});

class CrazyEights extends Component<{}, CrazyEightsState> {
  private cardDeck: Array<any>;
  private discardPile: Array<any>;
  private hands: Array<any>;
  private NUMPLAYERS: number;
  private numPlayersRef: any;
  private usernameRef: any;
  private channel: any;
  private userName: string;
  private userNameList: any;

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      rulesset: false,
      linkgiven: false,
      customLink: "Loading link...",
      gameId: "",
      numConnected: 1
    }
    this.cardDeck = [];
    this.discardPile = [];
    this.hands = [];
    this.NUMPLAYERS = 3;
    this.numPlayersRef = React.createRef();
    this.usernameRef = React.createRef();
    this.channel = "";
    this.userName = "";
    this.userNameList = {};

    this.setRules = this.setRules.bind(this);
    this.startLinkMonitor = this.startLinkMonitor.bind(this);
    this.computerJoined = this.computerJoined.bind(this);
  }

  componentDidMount() {
    if (!this.state.loaded) {
      axios.get(config["flaskServer"]+"deckgen/regdecknj").then((response: any) => {
        this.cardDeck = []
        for (var i=0; i<response['data']['data'].length; i++) {
          this.cardDeck.push(RegDeck[response['data']['data'][i]]);
        }
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
          CARDS: [this.hands[this.state.numConnected][0].toDict(),this.hands[this.state.numConnected][1].toDict(),
          this.hands[this.state.numConnected][2].toDict(),this.hands[this.state.numConnected][3].toDict(),
          this.hands[this.state.numConnected][4].toDict(),this.hands[this.state.numConnected][5].toDict(),
          this.hands[this.state.numConnected][6].toDict()]
        }
      }).then(()=> {
        this.userNameList[data['FROM']]=data['USERNAME'];
        this.setState((prev: any) => {
          return ({
            numConnected: prev.numConnected+1
          })
        })
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
      this.hands = [];
      for (var player = 0; player<this.NUMPLAYERS; player++) {
        this.hands.push([]);
        for (var card = 0; card<7; card++) {
          this.hands[player].push(this.cardDeck.shift());
        }
      }
      console.log(this.hands);
      this.userName = this.usernameRef.current.value;
      this.userNameList['SERVER']=this.userName+" (Host)";
      this.setState({
        loaded: true,
        rulesset: true,
        linkgiven: false,
      });
    }
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
    return (
      <Stage width={window.innerHeight*1.5} height={window.innerHeight}>
        <Layer>
          <UrlImage src="https://infinitecards.s3.us-east-1.amazonaws.com/Card_back_01.svg.png" x={(window.innerHeight*1.5)/2-60} y={(window.innerHeight/2)-87} width={120} height={174} />
          <UrlImage src={this.cardDeck[0].image} x={(window.innerHeight*1.5)/2-40} y={window.innerHeight-174} width={120} height={174} draggable/>
          <UrlImage src={this.cardDeck[1].image} x={(window.innerHeight*1.5)/2-20} y={window.innerHeight-174} width={120} height={174}/>
          <UrlImage src={this.cardDeck[2].image} x={(window.innerHeight*1.5)/2-0} y={window.innerHeight-174} width={120} height={174}/>
          <UrlImage src={this.cardDeck[3].image} x={(window.innerHeight*1.5)/2+20} y={window.innerHeight-174} width={120} height={174}/>
          <UrlImage src={this.cardDeck[4].image} x={(window.innerHeight*1.5)/2+40} y={window.innerHeight-174} width={120} height={174}/>

          <UrlImage src={this.cardDeck[5].image} x={(window.innerHeight*1.5)/2-40} y={0} width={120} height={174}/>
          <UrlImage src={this.cardDeck[6].image} x={(window.innerHeight*1.5)/2-20} y={0} width={120} height={174}/>
          <UrlImage src={this.cardDeck[7].image} x={(window.innerHeight*1.5)/2-0} y={0} width={120} height={174}/>
          <UrlImage src={this.cardDeck[8].image} x={(window.innerHeight*1.5)/2+20} y={0} width={120} height={174}/>
          <UrlImage src={this.cardDeck[9].image} x={(window.innerHeight*1.5)/2+40} y={0} width={120} height={174}/>
        </Layer>
      </Stage>
    );
  }
}

export default CrazyEights;