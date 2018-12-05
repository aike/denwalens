import React from 'react';

class Footer extends React.Component {
  render() {
    return(
      <div>
        <div style={{minHeight:'calc(100vh - 470px)'}}>
        </div>
        <div style={{textAlign:'left', height:'54px', paddingLeft: '20px'}}>
          <a style={{
            position:'absolute',
            zIndex:'10'
          }}
           href="https://aike.hatenablog.com/entry/2018/12/09"><img src="info.png" alt="info" /></a>
        </div>
      </div>
    );
  }	
}

export default Footer;
