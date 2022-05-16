import React from 'react';
import imageDict from '../scripts/imageDict';

import '../styles/NavButton.css';

interface NavButtonProps {
    innerText: string,
    imageSRC: string,
    backgroundColor: string,
}

class NavButton extends React.Component<NavButtonProps,{}> {
    constructor(props: NavButtonProps) {
        super(props);
    }

    render() {
        return (
            <button style={{width: 90, height: 40, backgroundColor: this.props.backgroundColor, borderRadius: "7px", border: "1px solid black", color: "white", fontFamily: "Rubik"}}>
                <table>
                    <th style={{width: "50%"}}>
                        <img src={imageDict[this.props.imageSRC as keyof typeof imageDict]} width="35%" style={{filter: "invert(1)"}}/>
                    </th>
                    <th style={{width: "50%"}}>
                        <p style={{margin: 0, textAlign: "left"}}>{this.props.innerText}</p>
                    </th>
                </table>
            </button>
        );
    }
}

export default NavButton;