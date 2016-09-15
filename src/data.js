const getLiveData = (symbols) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const url = 'https://www.google.com/finance/info?client=ig&q=' + symbols.join(',');

    request.open('GET', url, true);

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 400) {
        const data = request.responseText.replace(/\//g, '');
        resolve({quotes: JSON.parse(data)});
      }
    });

    request.addEventListener('error', (e) => {
      console.log('error! ' + e);
      reject('Error');
    });

    request.send();
  });
}

const getHistoricalData = (symbol) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const url = 'https://www.google.com/finance/getprices?p=9d&i=86400&f=d,c,v&q=' + symbol;

    request.open('GET', url, true);

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 400) {
        let data = request.responseText.split('\n').slice(7);
        data.splice(-1, 1);

        let startDate;
        const parsedData = data.map((obj, index) => {
          let quote = obj.split(',');
          let timestamp = quote[0].replace('a', '');

          if(index == 0) {
            timestamp = timestamp * 1000;
            startDate = timestamp;
          } else {
            timestamp = timestamp * 1000 * 86400 + startDate;
          }

          let date = new Date(timestamp);

          return {
            date: date.toLocaleDateString(),
            price: quote[1],
            volume: quote[2]
          }
        });

        resolve(parsedData);
      }
    });

    request.addEventListener('error', (e) => {
      console.log('error! ' + e);
      reject('Error');
    });

    request.send();
  });

}

module.exports = {
  getLiveData: getLiveData,
  getHistoricalData: getHistoricalData
}
