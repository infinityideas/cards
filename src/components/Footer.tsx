import React from 'react';

import '../styles/Footer.css';

class Footer extends React.Component<{},{}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div style={{textAlign: "center"}}>
                <p>Created by Darius for AP Computer Science A. Source code <a href="#">here</a> and system status <a href="https://status.infinityideas.dev">here</a>.</p>
            </div>
        );
    }
}

export default Footer;