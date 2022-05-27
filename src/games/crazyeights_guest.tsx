import React from 'react';
import { useParams } from 'react-router';
import HeaderText from '../components/HeaderText';
import config from '../scripts/Config';
import Pusher from 'pusher-js';
import UrlImage from '../components/UrlImage';
import { Stage, Layer } from 'react-konva';

const axios = require('axios');
const backSrc = "https://infinitecards.s3.us-east-1.amazonaws.com/card_design_BBN3.png";

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
            discardPile: {}
        };

        this.joinClick = this.joinClick.bind(this);
        this.joinRSP = this.joinRSP.bind(this);
        this.welcome = this.welcome.bind(this);

        this.gameId = this.props.params.id;
        this.nameref = React.createRef();
        this.order = 0;
        this.hand = [];
        this.others = [];

        this.channel = pusher.subscribe(this.gameId);
        this.channel.bind("JOIN_RSP", this.joinRSP);
        this.channel.bind("WELCOME", this.welcome);
    }

    welcome(data: any) {
        this.setState({
            inGame: true,
        })
    }

    joinRSP(data: any) {
        if (!data['FAILURE'] && data['TO'] == this.state.playerId) {
            this.order = data['ORDER'];
            this.hand = data['CARDS'];
            for (var i=0; i<data['NUMPLAYERS']; i++) {
                if (i==this.order) {
                    this.others.push(this.hand.length);
                } else {
                    this.others.push(7);
                }
            }
            this.setState({
                discardPile: data['DISCARD']
            })
        }
    }

    generatePlay() {
        var locationsX = [(window.innerHeight*1.5)/2-Math.floor(this.others[0]/2)*20-40, window.innerHeight*1.5-54, (window.innerHeight*1.5)/2-Math.floor(this.others[0]/2)*20-40, 0];
        var locationsY = [window.innerHeight-174, (window.innerHeight/2)-Math.floor(this.others[1]/2)*20-40, 0, (window.innerHeight/2)-Math.floor(this.others[1]/2)*20+40];
    
        var changeX = [true, false, true, false];
        var changeY = [false, true, false, true];
    
        var imageDB = [];
        var currentX = 0;
        var currentY = 0;
    
        imageDB.push(<UrlImage width={120} height={174} src={backSrc} x={window.innerHeight*1.5/2-125} y={window.innerHeight/2-87} draggable={false} rot={0}/>);
        imageDB.push(<UrlImage width={120} height={174} src={this.state.discardPile.image} x={window.innerHeight*1.5/2+5} y={window.innerHeight/2-87} draggable={false} rot={0} />);
    
        for (var i=0; i<this.others.length+1; i++) {
          currentX = locationsX[i];
          currentY = locationsY[i];
    
          for (var x=0; x<this.others[i]; x++) {
            if (i>0) {
              if (i==1) {
                if (i==this.order) {
                    imageDB.push(<UrlImage src={this.hand[x].image} x={currentX} y={currentY} width={120} height={174} draggable={true} rot={90} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87}/>)
                } else {
                    imageDB.push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={90}/>);
                }       
              } else if (i==3) {
                if (i==this.order) {
                    imageDB.push(<UrlImage src={this.hand[x].image} x={currentX} y={currentY} width={120} height={174} draggable={true} rot={-90} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87}/>)
                } else {
                    imageDB.push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={-90}/>);
                }
              } else {
                if (i==this.order) {
                    imageDB.push(<UrlImage src={this.hand[x].image} x={currentX} y={currentY} width={120} height={174} draggable={true} rot={0} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87}/>)
                } else {
                    imageDB.push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={0}/>);   
                }
              }
              if (changeX[i]) {
                currentX += 20;
              }
              if (changeY[i]) {
                currentY += 20;
              }
            } else {
              imageDB.push(<UrlImage src={backSrc} x={currentX} y={currentY} width={120} height={174} draggable={false} rot={0} discardX={window.innerHeight*1.5/2+5} discardY={window.innerHeight/2-87}/>);
              currentX += 20;
            }
          }
        }
    
        return (<Layer>
          {imageDB}
          
        </Layer>)
        
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
        var toReturn = this.generatePlay();
        return (
            <Stage width={window.innerHeight*1.5} height={window.innerHeight}>
                {toReturn}
            </Stage>
        )
    }
}

export default (props: any) => (
    <CrazyEightsGuest
        {...props}
        params={useParams()}
    />
)