import React, {Component} from 'react';
import './App.css';
import './bootstrap.css';
import './codemirror.css';
import Form from './lib/form';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <Form format="default" text={"random text"}/>
                        </div>
                        <div className="col-6">
                            <Form format="php" text={"$x = 5 + 5; echo $x;"}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <Form format="json" text={'{"data":{"key": [1, 2.3, "value"]}}'}/>
                        </div>
                        <div className="col-6">
                            <Form format="xml" text={"<xml><data1>data1</data1><data2>data2</data2></xml>"}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
