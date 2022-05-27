import React from 'react';
import Footer from './components/Footer';
import GameCard from './components/GameCard';
import HeaderText from './components/HeaderText';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Play.css';

class Play extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderText innerText='Play!' subText={<div><p>Choose the game you want to play.</p></div>} />
                <div className="gamecardholder">
                    <table style={{display: "inline"}}>
                        <tbody>
                            <tr>
                                <td>
                                    <GameCard gameName="Crazy 8s" gameDesc="Essentially an online game of Uno!" gameAdd="crazyeights" />
                                </td>
                                <td>
                                    <GameCard gameName="Another Game" gameDesc="Another game!" gameAdd="#" />
                                </td>
                                <td>
                                    <GameCard gameName="OMG! The Game" gameDesc="OMG" gameAdd="#" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Play;