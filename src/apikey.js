import React from 'react';

class APIKey extends React.Component {

  api_key = '';       // <---- YOUR API KEY

  componentDidMount() {
    if (this.api_key !== '') {
      this.props.onChange(this.api_key);
    } else {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', './key/key.txt', true);
      xhr.onload = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this.api_key = xhr.responseText;
            this.props.onChange(this.api_key);
          }
        }
      };
      xhr.send(null);
    }
  }

  render() {
    return(
      <div style={{display:'none'}} onChange={this.props.changeKey} >
      </div>
    );
  }	
}

export default APIKey;
