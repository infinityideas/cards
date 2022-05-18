import React from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import NavButton from './NavButton';

interface GameCardProps {
    gameName: string,
    gameDesc: string,
    gameAdd: string
}

class GameCard extends React.Component<GameCardProps, {}> {
    constructor(props: GameCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="card" style={{width: "18em"}}>
                <div className="card-body">
                    <h5 className="card-title">{this.props.gameName}</h5>
                    <p className="card-text">{this.props.gameDesc}</p>
                    <div style={{paddingRight: "10px", display: "inline"}}>
                        <NavButton innerText="Play" imageSRC="play" backgroundColor="#ed5645" toLink={"/games/"+this.props.gameAdd}/>
                    </div>
                    <NavButton innerText="Rules" imageSRC="about" backgroundColor="#0284e0" toLink={"/rules/"+this.props.gameAdd}/>
                </div>
            </div>          
        );
    }
}

export default GameCard;