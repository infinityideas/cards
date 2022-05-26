import React from 'react';

interface ShareProps {
    innerText: string,
    shareText: string,
    backgroundColor: string,
}

class ShareButton extends React.Component<ShareProps, {}> {
    private buttonRef: any;

    constructor(props: ShareProps) {
        super(props);

        this.buttonRef = React.createRef();

        this.onClick = this.onClick.bind(this);
    }

    onClick(e: any) {
        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            navigator.share({text: this.props.shareText});
        } else {
            navigator.clipboard.writeText(this.props.shareText);
            this.buttonRef.current.innerText = "Copied!";
            setTimeout(() => {
                this.buttonRef.current.innerText="Share";
            }, 2000);
        }
    }

    render() {
        return (
            <div>
                <button style={{backgroundColor: this.props.backgroundColor}} onClick={this.onClick} ref={this.buttonRef}>{this.props.innerText}</button>
            </div>
        )
    }
}

export default ShareButton;