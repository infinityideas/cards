import React from 'react';
import HeaderText from './components/HeaderText';
import NavButton from './components/NavButton';
import Footer from './components/Footer';

import './styles/App.css';

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        let subText = <p>Online realtime multiplayer card games.</p>

        return (
            <div>
                <HeaderText innerText="Cards" subText={subText}/>
                <div id="ButtonHolder" style={{paddingBottom: "15px"}}>
                   <NavButton innerText="Play" imageSRC="play" backgroundColor="#ed5645" toLink="/play"/>
                   <NavButton innerText="About" imageSRC="about" backgroundColor="#0284e0" toLink="/about"/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default App;