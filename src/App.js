import React, { Component } from 'react';
import './App.css';
import APIKey from './apikey';
import Footer from './footer';

class App extends Component {

  state = {
    key: '',
    showWait: false
  };

 componentDidMount() {
    document.querySelector('#filesel').addEventListener('change', ev => {
      if (!ev.target.files || ev.target.files.length === 0) return;
      Promise.resolve(ev.target.files[0])
        .then(this.readFile)
        .then(file => {return this.sendAPI(file, this.state.key);})
        .then(res => {
          console.log('SUCCESS');
          this.parseResult(res);
          this.setState({showWait:false});
        })
        .catch(err => {
          console.log('FAILED');
          this.setState({showWait:false});
        });
    });
  }

  sendAPI(base64string, key) {
    this.setState({showWait:true});
    let body = {
      requests: [
        {image: {content: base64string}, features: [{type: 'TEXT_DETECTION'}]}
      ]
    };
    let xhr = new XMLHttpRequest();
    const url = 'https://vision.googleapis.com/v1/images:annotate?key='+key;
    xhr.open('POST', url, true);
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
    // 結果リスト消去（高速版）
    const result = document.querySelector('#resultarea');
    if (result.firstChild !== null) {
      result.removeChild(result.firstChild);
    }

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
    const arr_annotations = json.responses[0].textAnnotations;
    const tel_numbers = [];
    arr_annotations.forEach((item) => {
      // 高速化のために短すぎる文字列はここで無視する
      if (item.description.length >= 10) {        
        const str = item.description;
        // 数字、ハイフン、カッコ、スペースの連続を電話番号とみなす
        const match_str = str.match(/[\d\-() ]+/g);
        // 電話番号が存在するか
        if (match_str !== null) {
          // 電話番号が複数存在する場合を考慮してループ
          match_str.forEach((item) => {
            // ハイフン、カッコ、スペースを削除して数字のみを得る
            const num = item.replace(/[-() ]/g, '');
            // 数字のみで10〜11桁のものを電話番号として配列にする
            if ((num.length >= 10) && (num.length <= 11)) {
              tel_numbers.push({str:item, num:num});
            }
          });
        }
      }
    });

    this.showResult(tel_numbers);
  }

  showResult(tel_numbers) {
    // 結果リスト表示（高速版）
    const hash = {};
    tel_numbers.forEach(item => {
      // 重複チェック
      if (!hash[item.num]) {
        hash[item.num] = true;
        const parent = document.querySelector('#resultarea');
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.innerText = item.str;
        a.href = 'tel:' + item.num;
        li.appendChild(a);
        parent.appendChild(li);
      }
    });
  }

  changeKey(key) {
    this.setState({key:key});
  }

  render() {
    return (
      <div className="App">

        <div id="logoarea">
          <img id="image" src="logo.png" alt="logo" />
        </div>

        <div id="contentarea">
          <div id="content">
            <div>電話番号専用 画像認識アプリ</div>

            <APIKey onChange={(key)=>{this.changeKey(key);}} />

            <div style={{ marginTop:'15px'}}>
              <input id="filesel" type="file" accept="image/*" />
            </div>

            {this.state.showWait && 
              <div style={{margin:'24px 20px'}}>wait ...</div>}

            <ul id="resultarea" style={{marginLeft:'-20px', fontSize:'18px', lineHeight:'24px'}}>
            </ul>
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
