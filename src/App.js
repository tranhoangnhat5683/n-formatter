import React, {Component} from 'react';
import './App.css';
import Form from './lib/form';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Form format="php" text={"random text"}/>
            </div>
        );
    }
}

export default App;
