import React from 'react';
import ReactDOM from 'react-dom';

class SymbolForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      symbol: ''
    }
  }

  onSymbolChange (e) {
    this.setState({symbol: e.target.value});
  }

  onSubmit () {
    this.props.onFormSubmit(this.state.symbol);
  }

  render () {
    return (
        <form>
          <label htmlFor="symbol">Symbol:</label>
          <input type="text" id="symbol" />

          <button type="submit">add</button>
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
    this.getQuoteData();
  }

  componentWillMount () {
    this.setState({symbols: ['AAPL', 'GOOG', 'SPY']});
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
        </tr>
      )
    };

    return (
      <div>
        <table>
          <tbody>
            { this.state.quotes.map(renderRow) }
          </tbody>
        </table>

        <SymbolForm onFormSubmit={this.addSymbol} />
      </div>
    )
  }
}

ReactDOM.render(<Ticker />, document.getElementById('ticker'));