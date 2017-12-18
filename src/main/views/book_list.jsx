import React from "react";
export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    render() {
        return (
            <div>
                <h2>Hello World {this.state.date.toLocaleTimeString()}</h2>
            </div>
        )
    }
}