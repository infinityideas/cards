import React from 'react';
import '../styles/HeaderText.css';

interface HeaderProps {
    innerText: string
    subText: JSX.Element
}

interface HeaderState {
    
}

class HeaderText extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);

    }

    render() {
       return (
           <div id="textContainer">
                <div id="textDiv">{this.props.innerText}<br/>{this.props.subText}</div>
           </div>
       )
    }
}

export default HeaderText;