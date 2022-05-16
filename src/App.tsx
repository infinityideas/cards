import React from 'react';
import HeaderText from './components/HeaderText';
import NavButton from './components/NavButton';

import './styles/App.css';

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderText innerText="Cards" />
                <div id="ButtonHolder">
                   <NavButton innerText="Play" imageSRC="play" backgroundColor="#ed5645" toLink="/play"/>
                   <NavButton innerText="About" imageSRC="about" backgroundColor="#0284e0" toLink="/about"/>
                </div>
            </div>
        );
    }
}

export default App;