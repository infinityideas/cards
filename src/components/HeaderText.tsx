import React from 'react';
import '../styles/HeaderText.css';

interface HeaderProps {
    innerText: string
}

interface HeaderState {
    
}

class HeaderText extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);

    }

    render() {
       return (
           <div style={{fontFamily: "Libre Baskerville"}}>Test</div>
       )
    }
}

export default HeaderText;