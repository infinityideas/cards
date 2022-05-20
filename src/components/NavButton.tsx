import React from 'react';
import imageDict from '../scripts/imageDict';
import { Link } from "react-router-dom";

import '../styles/NavButton.css';

interface NavButtonProps {
    innerText: string,
    imageSRC: string,
    backgroundColor: string,
    toLink: string,
}

class NavButton extends React.Component<NavButtonProps,{}> {
    constructor(props: NavButtonProps) {
        super(props);
    }

    render() {
        return (
            <Link to={this.props.toLink}>
                <button style={{width: 90, height: 40, backgroundColor: this.props.backgroundColor, borderRadius: "7px", border: "1px solid black", color: "white", fontFamily: "Rubik", marginRight: "10px"}}>
                    <table>
                        <th style={{width: "50%"}}>
                            <img src={imageDict[this.props.imageSRC as keyof typeof imageDict]} width="13px" style={{filter: "invert(1)"}}/>
                        </th>
                        <th style={{width: "50%"}}>
                            <p style={{margin: 0, textAlign: "left"}}>{this.props.innerText}</p>
                        </th>
                    </table>
                </button>
            </Link>
        );
    }
}

export default NavButton;