import React from 'react';
import ReactDOM from 'react-dom';

class Ticker extends React.Component {
  render () {
    return (
        <div>
          <h2>Hello!!!</h2>
        </div>
    )
  }
}

ReactDOM.render(<Ticker />, document.getElementById('ticker'));