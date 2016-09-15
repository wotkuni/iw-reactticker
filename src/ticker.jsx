'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Button, Table } from 'react-bootstrap';
import { getLiveData, getHistoricalData } from './data.js'

const DEFAULT_SYMBOLS = ['AAPL', 'GOOG', 'SPY'];

class SymbolForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      symbol: ''
    };

    this.onSymbolChange = this.onSymbolChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSymbolChange (e) {
    this.setState({symbol: e.target.value});
  }

  onSubmit (e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.symbol);
  }

  render () {
    return (
        <form onSubmit={this.onSubmit}>
          <label htmlFor="symbol">Symbol:</label>
          <input type="text" id="symbol" onChange={this.onSymbolChange}/>

          <Button bsStyle="primary" type="submit">Add</Button>
        </form>
    )
  }
}

class TickerTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.rows }
        </tbody>
      </Table>
    )
  }
}

class HistoricalData extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: []
    }
  }

  getData() {
    getHistoricalData(this.props.symbol)
      .then((data) => {
        this.setState({data: data});
      })
      .catch((err) => console.log('error: ' + err.message));
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Table bordered>
        <thead>
          <tr><th>Date</th><th>Price</th><th>Vol</th></tr>
          {this.state.data.map((d, i) => {
            return <tr key={i}><td>{d.date}</td><td>{d.price}</td><td>{d.volume}</td></tr>
          })}
        </thead>
      </Table>
    )
  }
}

class Ticker extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      symbols: [],
      quotes: [],
      historical: []
    };
  }

  getQuoteData() {
    getLiveData(this.state.symbols)
      .then((data) => {
        this.setState(data);
      })
      .catch((err) => console.log('error: ' + err.message));
  }

  addSymbol(symbol) {
    let symbols = this.state.symbols;
    symbols.push(symbol);
    this.setSymbols(symbols);

    this.getQuoteData();
  }

  deleteSymbol(symbol) {
    let symbols = this.state.symbols;
    symbols.splice(symbols.lastIndexOf(symbol), 1);
    this.setSymbols(symbols);
  }

  setSymbols(symbolArr) {
    this.setState({symbols: symbolArr});
    localStorage.symbols = symbolArr.join(',');
  }

  showHistorical(symbol) {
    let his = this.state.historical;
    if(!his.includes(symbol)) {
      his.push(symbol);
      this.setState({historical: his});
    }
  }

  componentWillMount() {
    let symbols = DEFAULT_SYMBOLS;

    if(localStorage.getItem('symbols')) {
      symbols = localStorage.getItem('symbols').split(',');
    } else {
      localStorage.setItem('symbols', symbols);
    }

    this.setState({symbols: symbols});
  }

  componentDidMount() {
    this.getQuoteData();

    window.setInterval(this.getQuoteData.bind(this), 5000);
  }

  renderHistorical (symbol) {
    if(this.state.historical.includes(symbol)) {
      return (
        <HistoricalData symbol={symbol} />
      )
    }
  }

  render() {
    let timestamp = new Date();

    let renderRow = (quote, index) => {
      return (
        <tr key={index}>
          <td onClick={this.showHistorical.bind(this, quote.t)}>{quote.t}</td>
          <td>{quote.l}</td>
          <td className="remove"><a href="#" onClick={this.deleteSymbol.bind(this, quote.t)}>delete</a></td>
          <td>{this.renderHistorical(quote.t)}</td>
        </tr>
      )
    };

    return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3} xs={12}>
            <TickerTable rows={this.state.quotes.map(renderRow)} />
            <p>Last updated {timestamp.toLocaleString()}</p>
          </Col>
        </Row>

        <Row>
          <Col md={6} mdOffset={3} xs={12}>
            <SymbolForm onFormSubmit={this.addSymbol.bind(this)} />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Ticker;
