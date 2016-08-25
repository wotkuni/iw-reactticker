import React from 'react';
import ReactDOM from 'react-dom';

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
    let that = this;

    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        let data = request.responseText.replace(/\//g, '');
        that.setState({quotes: JSON.parse(data)});
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
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
      </div>
    )
  }
}

ReactDOM.render(<Ticker />, document.getElementById('ticker'));