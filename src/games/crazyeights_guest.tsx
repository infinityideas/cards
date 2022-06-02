import React from 'react';
import { useParams } from 'react-router';
import HeaderText from '../components/HeaderText';
import config from '../scripts/Config';
import Pusher from 'pusher-js';
import UrlImage from '../components/crazyeights/UrlImage';
import { Stage, Layer } from 'react-konva';
import { CanDraw } from '../components/crazyeights/CanDraw';

const axios = require('axios');
const backSrc = "https://infinitecards.s3.us-east-1.amazonaws.com/card_design_BBN3.png";
const turnindicator = "https://infinitecards.s3.us-east-1.amazonaws.com/turnindicator.png";

Pusher.logToConsole = true;
var pusher = new Pusher(config["pusherKey"], {
  cluster: 'us2'
});

interface GuestProps {
    playerId: string,
    hand: Array<any>,
    inGame: boolean,
    playerName: string,
    inWaiting: boolean,
    discardPile: any,
    currentPlayer: number,
    reset: boolean,
    currentDraw: number,
    others: Array<number>
}

class CrazyEightsGuest extends React.Component<any, GuestProps> {
    private gameId: string;
    private nameref: any;
    private channel: any;
    private order: number;
    private hand: Array<any>;
    private others: Array<number>;

    constructor(props: any) {
        super(props);

        this.state = {
            playerId: "",
            hand: [],
            inGame: false,
            playerName: "",
            inWaiting: true,
            discardPile: {},
            currentPlayer: 0,
            reset: false,
            currentDraw: 0,
            others: []
        };

        this.joinClick = this.joinClick.bind(this);
        this.joinRSP = this.joinRSP.bind(this);
        this.welcome = this.welcome.bind(this);
        this.carddown = this.carddown.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.onClick_Draw = this.onClick_Draw.bind(this);
        this.onClick_DrawC = this.onClick_DrawC.bind(this);
        this.onDraw = this.onDraw.bind(this);

        this.gameId = this.props.params.id;
        this.nameref = React.createRef();
        this.order = 0;
        this.hand = [];
        this.others = [];

        this.channel = pusher.subscribe(this.gameId);
        this.channel.bind("JOIN_RSP", this.joinRSP);
        this.channel.bind("WELCOME", this.welcome);
        this.channel.bind("CARDDOWN", this.carddown);
        this.channel.bind("DRAW_RSP", this.onClick_DrawC);
        this.channel.bind("DRAW", this.onDraw);
    }

    carddown(data: any) {
        if (data['FROMORDER'] == this.order) {
            return;
        }
        var newOthers = this.state.others.slice();
        newOthers[data['FROMORDER']] = data['NUMCARDS'];
        console.log(this.state.others);
        this.setState({
            currentPlayer: data['NEXTPLAYER'],
            discardPile: data['CARDDOWN'],
            reset: true,
            others: newOthers
        });
    }

    welcome(data: any) {
        this.setState({
            inGame: true,
        })
    }

    joinRSP(data: any) {
        if (!data['FAILURE'] && data['TO'] == this.state.playerId) {
            this.order = data['ORDER'];
            var newOthers = [];
            for (var i=0; i<data['NUMPLAYERS']; i++) {
                newOthers.push(7);
            }
            this.setState({
                discardPile: data['DISCARD'],
                hand: data['CARDS'],
                others: newOthers
            })
        }
    }

    dragEnd(current: any) {
        var currentList = [];
        for (var i=0; i<this.state.hand.length; i++) {
          currentList.push(this.state.hand[i].toString);
        }
        const index = currentList.indexOf(current.toString);
        var newOthers = this.state.others.slice();
        newOthers[this.order] = newOthers[this.order]-1;
        console.log(currentList);
        console.log(current);
        console.log(index);
        console.log(this.state.hand);
        var newHand = [];
        for (var x=0; x<this.state.hand.length; x++) {
          if (x != index) {
            newHand.push(this.state.hand[x]);
          }
        }
        console.log(newHand);
    
        var toUpdate = newHand;
        console.log(this.state.discardPile);
        console.log(this.state.hand);
        axios.post(config['flaskServer']+"publish", {
          GAME: this.gameId,
          MSG: "CARDDOWN",
          PARAMS: {
            TO: "ALL",
            FROM: this.state.playerId,
            FROMORDER: this.order,
            NUMCARDS: toUpdate.length,
            CARDDOWN: current,
            NEXTPLAYER: this.order == this.state.others.length-1 ? 0 : this.order+1
          }
        }).then(() => {
          this.setState({
            currentPlayer: this.order+1 == this.state.others.length ? 0 : this.order+1,
            reset: true,
            discardPile: current,
            hand: toUpdate,
            others: newOthers
          });
        })
      }

      componentDidUpdate() {
        if (this.state.reset) {
            this.setState({
                reset: false
            });
        }
      }

      onClick_DrawC(data: any) {
        if (data['TO'] != this.order) {
            return;
        }
        var newOthers = this.state.others.slice();
        newOthers[this.order] = newOthers[this.order]+1;
        if (this.state.currentDraw==2) {
            axios.post(config['flaskServer']+"publish", {
              GAME: this.gameId,
              MSG: "DRAW",
              PARAMS: {
                TO: "ALL",
                FROM: this.state.playerId,
                FROMORDER: this.order,
                NEXTPLAYER: this.order == this.state.others.length-1 ? 0 : this.order+1,
                ENDTURN: true,
                NUMCARDS: this.state.hand.length+1
              }
            }).then(() => {
              var toReturn = this.state.hand.slice();
              toReturn.push(data['PARAMS']['DRAWNCARD']);
              this.setState({
                currentDraw: 0,
                currentPlayer: this.order == this.state.others.length-1 ? 0 : this.order+1,
                hand: toReturn,
                reset: true,
                others: newOthers
              })
            })
          } else {
            axios.post(config['flaskServer']+"publish", {
              GAME: this.gameId,
              MSG: "DRAW",
              PARAMS: {
                TO: "ALL",
                FROM: this.state.playerId,
                FROMORDER: this.order,
                ENDTURN: false,
                NUMCARDS: this.state.hand.length+1
              }
            }).then(() => {
              var toReturn = this.state.hand.slice();
              toReturn.push(data['PARAMS']['DRAWNCARD']);
              this.setState({
                  currentDraw: this.state.currentDraw + 1,
                  hand: toReturn,
                  reset: true,
                  others: newOthers
                }
              )
            })
          }
      }

      onClick_Draw() {
        axios.post(config['flaskServer']+"publish", {
            GAME: this.gameId,
            MSG: "DRAW_RQ",
            PARAMS: {
                TO: "SERVER",
                FROM: this.order
            }
        })
      }
    
      onDraw(data: any) {
        if (data['FROMORDER'] == this.order) {
            return;
        }
        var newOthers = this.state.others.slice();
        newOthers[data['FROMORDER']] = data['NUMCARDS'];
        if (data['ENDTURN']) {
            this.setState({
                currentPlayer: data['NEXTPLAYER'],
                reset: true,
                others: newOthers
            })
        } else {
            this.setState({
                reset: true,
                others: newOthers
            })
        }
      }
      generatePlay() {
        console.log(this.state);
        console.log(this.state.others);
        console.log(this.order);
        console.log(this.state.hand);
        var locationsX = [(window.innerHeight*1.5)/2-Math.floor(this.state.others[0]/2)*20-40, window.innerHeight*1.5-54, (window.innerHeight*1.5)/2-Math.floor(this.state.others[0]/2)*20-40, 0];
        var locationsY = [window.innerHeight-174, (window.innerHeight/2)-Math.floor(this.state.others[1]/2)*20-40, 0, (window.innerHeight/2)-Math.floor(this.state.others[1]/2)*20+40];
    
        var changeX = [true, false, true, false];
        var changeY = [false, true, false, true];
    
        var imageDB: Array<any> = [[]];
        var currentX = 0;
        var currentY = 0;

        var drawChance: boolean = false;

        if ((this.state.currentPlayer == this.order) && (CanDraw(this.state.hand[0], this.state.discardPile))) {
            drawChance = true;
        }

        imageDB[0].push(<UrlImage width={120} height={174} src={backSrc} x={window.innerHeight*1.5/2-125} y={window.innerHeight/2-87} draggable={false} rot={0} cursor={drawChance ? "grab" : "not-allowed"} clickAllowed={drawChance} onClick={this.onClick_Draw}/>);
        imageDB[0].push(<UrlImage width={120} height={174} src={this.state.discardPile.image} x={window.innerHeight*1.5/2+5} y={window.innerHeight/2-87} draggable={false} rot={0} />);
    
        for (var i=0; i<this.state.others.length+1; i++) {
          currentX = locationsX[i];
          currentY = locationsY[i];
          imageDB.push([]);
    
          for (var x=0; x<this.state.others[i]; x++) {
            console.log(i+" "+x);
            if (i>0) {
              if (i==1) {
                if (i==this.order) {
                    console.log(currentX+" "+currentY);
                    imageDB[i+1].push(<UrlImage src={this.state.hand[x].image} x={currentX} y={currentY} width={120} height={174} draggable={this.state.currentPlayer == this.order ? true : false} rot={90} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87} discard={this.state.discardPile} current={this.state.hand[x]} cursor={this.state.currentPlayer == this.order ? "grab" : "not-allowed"} dragEnd = {this.dragEnd}/>)
                } else {
                    imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={90}/>);
                }       
              } else if (i==3) {
                if (i==this.order) {
                    imageDB[i+1].push(<UrlImage src={this.state.hand[x].image} x={currentX} y={currentY} width={120} height={174} draggable={this.state.currentPlayer == this.order ? true : false} rot={-90} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87} discard={this.state.discardPile} current={this.state.hand[x]} cursor={this.state.currentPlayer == this.order ? "grab" : "not-allowed"} dragEnd = {this.dragEnd}/>)
                } else {
                    imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={-90}/>);
                }
              } else {
                if (i==this.order) {
                    imageDB[i+1].push(<UrlImage src={this.state.hand[x].image} x={currentX} y={currentY} width={120} height={174} draggable={this.state.currentPlayer == this.order ? true : false} rot={0} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87} discard={this.state.discardPile} current={this.state.hand[x]} cursor={this.state.currentPlayer == this.order ? "grab" : "not-allowed"} dragEnd = {this.dragEnd}/>)
                } else {
                    imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={0}/>);   
                }
              }
              if (changeX[i]) {
                currentX += 20;
              }
              if (changeY[i]) {
                currentY += 20;
              }
            } else {
                console.log("but why")
              imageDB[i+1].push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={0} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87}/>);
              currentX += 20;
            }
          }
        }

        imageDB.push([]);
        var turnIndicatorX = [window.innerHeight*1.5/2-25, window.innerHeight*1.5-300, window.innerHeight*1.5/2-25, 300];
        var turnIndicatorY = [window.innerHeight-250, window.innerHeight/2-25, 224, window.innerHeight/2-25];

        imageDB[imageDB.length-1].push(<UrlImage src={turnindicator} x={turnIndicatorX[this.state.currentPlayer]} y={turnIndicatorY[this.state.currentPlayer]} width={50} height={50} draggable={false} rot={0}/>)

        var layerDB = [];
        for (var z=0; z<imageDB.length; z++) {
            layerDB.push(<Layer>{imageDB[z]}</Layer>);
        }
    
        return (<Stage width={window.innerHeight*1.5} height={window.innerHeight}>
            {layerDB}
        </Stage>)
        
      }

    joinClick() {
        axios.get(config['flaskServer']+"accessidgen").then((response: any) => {
            axios.post(config['flaskServer']+"publish", {
                GAME: this.gameId,
                MSG: "JOIN",
                PARAMS: {
                    USERNAME: this.nameref.current.value,
                    TO: "SERVER",
                    FROM: response['data']['data'],
                }
            });
            this.setState({
                playerId: response['data']['data']
            })
        });
    }

    render() {
        if (!this.state.inGame) {
            return (
                <div>
                    <HeaderText innerText="Crazy Eights" subText={<p>Welcome! To join the game, enter a username below.</p>} />
                    <div style={{textAlign: "center"}}>
                        <label htmlFor="nameinput" style={{paddingRight: 10}}>Enter your username:</label>
                        <input name="nameinput" type="text" ref={this.nameref}/><br/><br/>
                        <button onClick={this.joinClick}>Join!</button>
                    </div>
                </div>
            )
        }
        if (this.state.reset) {
            return (
                <div></div>
            )
        }
        var toReturn = this.generatePlay();
        return (
            <div>
                {toReturn}
            </div>
        )
    }
}

export default (props: any) => (
    <CrazyEightsGuest
        {...props}
        params={useParams()}
    />
)