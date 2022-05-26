import { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import RegDeck from '../scripts/CardDict';
import useImage from 'use-image';

const axios = require('axios');

interface CrazyEightsState {
  loaded: boolean
}

const UrlImage = (props: any) => {
  const [image] = useImage(props.src);
  return <Image image={image} x={props.x} y={props.y} width={props.width} height={props.height} draggable/>
}

class CrazyEights extends Component<{}, CrazyEightsState> {
  private cardDeck: Array<any>;

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false
    }
    this.cardDeck = [];
  }

  componentDidMount() {
    if (!this.state.loaded) {
      axios.get("http://127.0.0.1:5000/deckgen/regdecknj").then((response: any) => {
        this.cardDeck = []
        for (var i=0; i<response['data']['data'].length; i++) {
          this.cardDeck.push(RegDeck[response['data']['data'][i]]);
        }
        console.log(this.cardDeck);
        this.setState({
          loaded: true
        })
      });
    }
  }

  render() {
    if (!this.state.loaded) {
      return (
        <div>Loading</div>
      )
    }
    return (
      <Stage width={window.innerHeight*1.5} height={window.innerHeight}>
        <Layer>
          <UrlImage src={this.cardDeck[0].image} x={(window.innerHeight*1.5)/2-40} y={window.innerHeight-232} width={160} height={232}/>
          <UrlImage src={this.cardDeck[1].image} x={(window.innerHeight*1.5)/2-20} y={window.innerHeight-232} width={160} height={232}/>
          <UrlImage src={this.cardDeck[2].image} x={(window.innerHeight*1.5)/2-0} y={window.innerHeight-232} width={160} height={232}/>
          <UrlImage src={this.cardDeck[3].image} x={(window.innerHeight*1.5)/2+20} y={window.innerHeight-232} width={160} height={232}/>
          <UrlImage src={this.cardDeck[4].image} x={(window.innerHeight*1.5)/2+40} y={window.innerHeight-232} width={160} height={232}/>
        </Layer>
      </Stage>
    );
  }
}

export default CrazyEights;