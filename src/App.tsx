import React from 'react';
import HeaderText from './components/HeaderText';

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderText innerText="Cards" />
            </div>
        );
    }
}

export default App;