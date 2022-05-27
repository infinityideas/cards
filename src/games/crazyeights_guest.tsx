import React from 'react';
import { useParams } from 'react-router';
import HeaderText from '../components/HeaderText';
import config from '../scripts/Config';
import Pusher from 'pusher-js';

const axios = require('axios');

Pusher.logToConsole = true;
var pusher = new Pusher(config["pusherKey"], {
  cluster: 'us2'
});

interface GuestProps {
    playerId: string,
    hand: Array<any>,
    inGame: boolean,
    playerName: string,
    inWaiting: boolean
}

class CrazyEightsGuest extends React.Component<any, GuestProps> {
    private gameId: string;
    private nameref: any;
    private channel: any;

    constructor(props: any) {
        super(props);

        this.state = {
            playerId: "",
            hand: [],
            inGame: false,
            playerName: "",
            inWaiting: true,
        };

        this.joinClick = this.joinClick.bind(this);

        this.gameId = this.props.params.id;
        this.nameref = React.createRef();
        this.channel = pusher.subscribe(this.gameId);
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
    }
}

export default (props: any) => (
    <CrazyEightsGuest
        {...props}
        params={useParams()}
    />
)