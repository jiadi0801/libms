import React from "react";
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import axios from 'axios';

export default class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            head: ['编号','书名','作者','出版社','ISBN','入库时间','借阅人','erp','借阅日期'],
            dialogType: '',
            visible: false,
            width: 600,
            target: null,
            record: null,
            borrower: '',
            erp: ''
        };

        this.borrow = this.borrow.bind(this);
        this.back = this.back.bind(this);
        this.sureBorrow = this.sureBorrow.bind(this);
        this.sureBack = this.sureBack.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changeBorrower = this.changeBorrower.bind(this);
        this.changeErp = this.changeErp.bind(this);
    }
    borrow(idx, e) {
        let target = e.target;
        this.setState({
            dialogType: 'borrow',
            target: target,
            record: this.props.books[idx]
        });
        target.disabled = true;
        this.setState({
            visible: true
        })
    }
    back(idx, e) {
        let target = e.target;
        this.setState({
            dialogType: 'back',
            target: target,
            record: this.props.books[idx]
        });
        target.disabled = true;
        this.setState({
            visible: true
        })
    }
    sureBorrow() {
        if (!this.state.borrower) {
            return;
        }
        axios.post('/borrow/new', {
            name: this.state.borrower,
            erp: this.state.erp,
            num: this.state.record.num
        })
        .then(res => {
            console.log(res.data)
            this.closeModal();
        })
        .then(() => {
            this.props.fetchBookList();
        })
    }
    sureBack() {
        axios.put('/borrow/back', {
            name: this.state.record.borrower,
            bor_time: this.state.record.bor_time,
            num: this.state.record.num
        })
        .then(res => {
            console.log(res.data)
            this.closeModal();
        })
        .then(() => {
            this.props.fetchBookList();
        })
    }
    closeModal() {
        this.state.target && (this.state.target.disabled = false);
        this.setState({
            visible: false,
            target: null,
            record: null,
            borrower: '',
            erp: '',
            dialogType: ''
        })
    }
    changeBorrower(e) {
        this.setState({borrower: e.target.value})
    }
    changeErp(e) {
        this.setState({erp: e.target.value})
    }
    render() {
        let dialog;
        if (this.state.visible && this.state.dialogType) {
            if (this.state.dialogType === 'borrow') {
                dialog = <Dialog 
                    visible={this.state.visible}
                    animation="zoom"
                    maskAnimation="fade"
                    style={{width: this.state.width, height: 100}}
                    onClose={this.closeModal} visible>
                    <p>借阅《{this.state.record.name}》</p>
                    <p><label htmlFor="">姓名：<input type="text" value={this.state.borrower} onChange={this.changeBorrower} /></label></p>
                    <p><label htmlFor="">erp ：<input type="text" value={this.state.erp} onChange={this.changeErp} /></label></p>
                    <button onClick={this.sureBorrow}>借阅</button>
                </Dialog>
            }
            else if (this.state.dialogType === 'back') {
                dialog = <Dialog 
                    visible={this.state.visible}
                    animation="zoom"
                    maskAnimation="fade"
                    style={{width: this.state.width, height: 100}}
                    onClose={this.closeModal} visible>
                    <p>确认归还《{this.state.record.name}》？</p>
                    <button onClick={this.sureBack}>归还</button>
                </Dialog>
            }
        }
        return (
            <div>
                <table className="table-book">
                    <thead>
                    <tr>{
                        this.state.head.map(h => {
                            return <th key={h}>{h}</th>
                        })
                    }</tr>
                    </thead>
                    <tbody>{
                    this.props.books && this.props.books.map((book,idx) => {
                        return <tr key={idx}>
                            <td>{book.num}</td>
                            <td><a href={book.link} target="_blank">{book.name}</a></td>
                            <td>{book.author}</td>
                            <td>{book.press}</td>
                            <td>{book.isbn}</td>
                            <td>{book.store_time && new Date(book.store_time).toLocaleDateString()}</td>
                            <td>{book.borrower}</td>
                            <td>{book.erp}</td>
                            {
                                !book.bor_time 
                                ? <td><button onClick={e => {this.borrow(idx, e)}}>借阅</button></td>
                                : <td>{new Date(book.bor_time).toLocaleDateString()}<button onClick={e => {this.back(idx, e)}}>归还</button></td>
                            }
                        </tr>
                    })
                    }</tbody>
                </table>
                {dialog}
            </div>
            
        );
    }
}