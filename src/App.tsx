import React from 'react';
import HeaderText from './components/HeaderText';
import NavButton from './components/NavButton';
import Footer from './components/Footer';

import logo from './assets/images/cards_logo.png';

import './styles/App.css';

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        let subText = <p>Online realtime multiplayer card games.</p>

        return (
            <div>
                <div style={{textAlign: "center"}}>
                    <img src={logo} style={{width: "30vw", marginTop: "20vh"}}/>
                    <p style={{marginBottom: 50}}>Online multiplayer card games.</p>
                </div>
                <div id="ButtonHolder" style={{paddingBottom: "60px"}}>
                   <NavButton innerText="Play" imageSRC="play" backgroundColor="#1fcc4d" toLink="/play"/>
                </div>
                <Footer/>
                <div style={{width: "50%", margin: "auto", textAlign: "center"}}>
                    <NavButton innerText="About" imageSRC="about" backgroundColor="#666666" toLink="/about"/>
                </div>
            </div>
        );
    }
}

export default App;