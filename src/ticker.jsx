import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';

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

class Ticker extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      symbols: [],
      quotes: []
    };

    this.defaultSymbols = ['AAPL', 'GOOG', 'SPY'];

    this.deleteSymbol = this.deleteSymbol.bind(this);
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
    this.setState({symbols: symbols});
    localStorage.symbols = symbols.join(',');
    this.getQuoteData();
  }

  deleteSymbol (row) {

  }

  componentWillMount () {
    let symbols = this.defaultSymbols;

    if(localStorage.getItem('symbols')) {
      symbols = localStorage.getItem('symbols').split(',');
    } else {
      localStorage.setItem('symbols', symbols);
    }

    this.setState({symbols: symbols});
  }

  componentDidMount () {
    this.getQuoteData();
  }

  render () {
    let renderRow = (quote, index) => {
      return (
        <tr key={index}>
          <td>{quote.t}</td>
          <td>{quote.l}</td>
          <td className="remove">delete</td>
        </tr>
      )
    };

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Last</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.state.quotes.map(renderRow) }
          </tbody>
        </table>

        <SymbolForm onFormSubmit={this.addSymbol.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(<Ticker />, document.getElementById('ticker'));