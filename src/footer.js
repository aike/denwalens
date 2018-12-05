import React from 'react';

class Footer extends React.Component {
  render() {
    return(
      <div>
        <div style={{minHeight:'calc(100vh - 470px)'}}>
        </div>
        <div style={{textAlign:'left', height:'54px', paddingLeft: '20px'}}>
          <a href="https://www.yahoo.co.jp"><img src="info.png" alt="info" /></a>
        </div>
      </div>
    );
  }	
}

export default Footer;
