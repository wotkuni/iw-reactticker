import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Button, Table } from 'react-bootstrap';

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
    constructor (props) {
      super(props);
    }

    render () {
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

class Ticker extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      symbols: [],
      quotes: []
    };
  }

  getQuoteData () {
    let request = new XMLHttpRequest();
    let url = 'https://www.google.com/finance/info?client=ig&q=' + this.state.symbols.join(',');

    let parseData = (request) => {
      if (request.status >= 200 && request.status < 400) {
        let data = request.responseText.replace(/\//g, '');
        this.setState({quotes: JSON.parse(data)});
      }
    };

    request.open('GET', url, true);

    request.onload = parseData.bind(this, request);

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
  }

  addSymbol (symbol) {
    let symbols = this.state.symbols;
    symbols.push(symbol);
    this.setSymbols(symbols);

    this.getQuoteData();
  }

  deleteSymbol (symbol) {
    let symbols = this.state.symbols;
    symbols.splice(symbols.lastIndexOf(symbol), 1);
    this.setSymbols(symbols);
  }

  setSymbols(symbolArr) {
    this.setState({symbols: symbolArr});
    localStorage.symbols = symbolArr.join(',');
  }

  componentWillMount () {
    let symbols = DEFAULT_SYMBOLS;

    if(localStorage.getItem('symbols')) {
      symbols = localStorage.getItem('symbols').split(',');
    } else {
      localStorage.setItem('symbols', symbols);
    }

    this.setState({symbols: symbols});
  }

  componentDidMount () {
    this.getQuoteData();

    window.setInterval(this.getQuoteData.bind(this), 5000);
  }

  render () {
    let timestamp = new Date();

    let renderRow = (quote, index) => {
      return (
        <tr key={index}>
          <td>{quote.t}</td>
          <td>{quote.l}</td>
          <td className="remove"><a href="#" onClick={this.deleteSymbol.bind(this, quote.t)}>delete</a></td>
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
