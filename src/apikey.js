import React from 'react';

class APIKey extends React.Component {

  state = {api_key:''};       // <---- YOUR API KEY

  componentDidMount() {
    if (this.state.api_key === '') {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', './key/key.txt', true);
      xhr.onload = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this.setState({api_key:xhr.responseText});
          }
        }
      };
      xhr.send(null);
    }
  }

  render() {
    return(
      <div style={{ display:'none'}}>
        API-KEY: <span id="api_key">{this.state.api_key}</span>
      </div>
    );
  }	
}

export default APIKey;
