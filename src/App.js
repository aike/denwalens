import React, { Component } from 'react';
import './App.css';
import APIKey from './apikey';
import Footer from './footer';

class App extends Component {

  state = {
    tel_numbers: []
  };

 componentDidMount() {
    document.querySelector('#filesel').addEventListener('change', ev => {
      if (!ev.target.files || ev.target.files.length === 0) return;
      this.setState({tel_numbers: []});
      Promise.resolve(ev.target.files[0])
        .then(this.readFile)
        .then(this.sendAPI)
        .then(res => {
          console.log('SUCCESS!', res);
          this.parseResult(res);
        })
        .catch(err => {
          console.log('FAILED:(', err);
        });
    });
  }

  sendAPI(base64string) {
    const api_key = document.querySelector('#api_key').value;
    let body = {
      requests: [
        {image: {content: base64string}, features: [{type: 'TEXT_DETECTION'}]}
      ]
    };
    let xhr = new XMLHttpRequest();
    const url = `https://vision.googleapis.com/v1/images:annotate`;
    xhr.open('POST', `${url}?key=${api_key}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const p = new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status >= 400) return reject({message: `Failed with ${xhr.status}:${xhr.statusText}`});
        resolve(JSON.parse(xhr.responseText));
      };
    })
    xhr.send(JSON.stringify(body));
    return p;
  }

  readFile(file) {
    let reader = new FileReader();
    const p = new Promise((resolve, reject) => {
      reader.onload = (ev) => {
        document.querySelector('#image').setAttribute('src', ev.target.result);
        resolve(ev.target.result.replace(/^data:image\/(png|jpeg);base64,/, ''));
      };
    });
    reader.readAsDataURL(file);
    return p;
  }

  parseResult(json) {
    const arr_json = json.responses[0].textAnnotations;
    // jsonの配列を文字列(複数行を含む)の配列にする
    const arr_multiline = arr_json.map(item => item.description);

    // 複数行の項目を分割して配列に再格納する
    let arr_line = [];
    arr_multiline.forEach((item) => {
      const lines = item.split('\n');
      lines.forEach((line) => {
        arr_line.push(line);
      })
    });

    // 数字、ハイフン、カッコ、スペースの連続を電話番号とみなす
    let tel_numbers = [];
    arr_line.forEach((str) => {
      const match_str = str.match(/[\d\-() ]+/g);
      // 電話番号が存在するか
      if (match_str !== null) {
        // 電話番号が複数存在する場合を考慮してループ
        match_str.forEach((item) => {
          // ハイフン、カッコ、スペースを削除して数字のみを得る
          const num = item.replace(/[-() ]/g, "");
          // 数字のみで10〜11桁のものを電話番号として配列にする
          if ((num.length >= 10) && (num.length <= 11)) {
            tel_numbers.push(item);
          }
        });
      }
    });

    // 一度Setにすることで重複要素を削除する
    const tel_uniq = Array.from(new Set(tel_numbers));
    this.setState({tel_numbers: tel_uniq});
  }

  render() {
    // 結果リストタグの作成
    const result = [];
    this.state.tel_numbers.forEach((item) => {
      const num = item.replace(/[-() ]/g, "");
      result.push(<li><a href={'tel:'+num}>{item}</a></li>);
    });

    return (
      <div className="App">

        <div id="logoarea">
          <img id="image" src="logo.png" alt="logo" />
        </div>

        <div id="contentarea">
          <div id="content">
            <div>電話番号専用 画像認識アプリ</div>

            <APIKey />

            <div style={{ marginTop:'15px'}}>
              <input id="filesel" type="file" accept="image/*" />
            </div>

            <ul style={{marginLeft:'-20px', fontSize:'18px', lineHeight:'24px'}}>
              {result}
            </ul>

          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
