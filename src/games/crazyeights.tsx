import React, { Component } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import RegDeck from '../scripts/CardDict';
import { Card } from '../scripts/Card';

const axios = require('axios');

interface CrazyEightsState {
  loaded: boolean
}

class ColoredRect extends React.Component {
  state = {
    color: 'green'
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Rect
        x={0}
        y={0}
        width={window.innerHeight*1.5}
        height={window.innerHeight}
        fill={this.state.color}
        onClick={this.handleClick}
      />
    );
  }
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
    axios.get("http://127.0.0.1:5000/deckgen/regdecknj").then((response: any) => {
      this.cardDeck = []
      for (var i=0; i<response['data']['data'].length; i++) {
        this.cardDeck.push(RegDeck[response['data']['data'][i]]);
      }
      
      this.setState({
        loaded: true
      })
    });
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
          <ColoredRect />
        </Layer>
      </Stage>
    );
  }
}

export default CrazyEights;