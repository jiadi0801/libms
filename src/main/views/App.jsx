import React from "react";
import Notice from './Notice.jsx';
import BookList from './BookList.jsx';
import axios from 'axios';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            booklist: []
        };
        this.fetchlist = this.fetchlist.bind(this);
    }
    componentWillMount() {
        this.fetchlist();
    }
    fetchlist() {
        axios.get('/borrow/list').then(res => {
            this.setState({
                booklist: res.data.data
            });
        });
    }
    render() {
        return (
            <div>
                <Notice />
                <h2 style={{position: 'relative'}}>书目<button className="add-book">增加书籍</button></h2>
                <BookList fetchBookList={this.fetchlist} books={this.state.booklist} />
                <footer className="footer">©京东用户体验设计部-前端开发部</footer>
            </div>
        );
    }
}