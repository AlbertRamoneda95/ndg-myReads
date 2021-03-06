import { render } from "react-dom"
import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'

export default class BookShelf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type
        }
    }
    getOptions = () => {
        return [
            { key: "currentlyReading", value: "Currently Reading"},
            { key: "wantToRead", value: "Want to Read"},
            { key: "read", value: "Read"},
            { key: "none", value: "None"}
        ]
    };

    handleBookShelfChange = (evt) => {
        const {id, value} = evt.target;
        const {onBookMove, books} = this.props;
        if (value.toLowerCase() !== "none") { //defer propagation for None value selection
            if (onBookMove) {
                onBookMove(books[id], this.state.type, value);
            }
        }
    }

    getDefaultOption = ((type, userBooks, book) => {
        var fnIsBookInBookShelf= function(book, bookShelf) {
            return bookShelf.some((element) => {
                return element.title === book.title;
            })
        }
        if (type !== "search") {
            return type;
        } else {
            for (const property in userBooks) {
                if (fnIsBookInBookShelf(book, userBooks[property])) {
                    this.setState({type:property})
                    return property;
                }
            }
            this.setState({type:"none"})
            return "none";
        }
    });


    render() {
        const {title, books, userBooks} = this.props;
        const options = this.getOptions();
        return(
            <div className="bookshelf">
            <h2 className="bookshelf-title">{title}</h2>
            <div className="bookshelf-books">
            <ol className="books-grid">
                {books.map((book, nIndex) => {
                    return(<li key= {nIndex}>
                        <div className="book">
                            <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.url + ')' }}></div>
                            <div className="book-shelf-changer">
                                <select id={nIndex} onChange={this.handleBookShelfChange} defaultValue={this.getDefaultOption(this.state.type, userBooks, book)}>
                                    <option value="move" disabled>Move to...</option>
                                    {options.map((option) => {
                                        return (<option  key={option.key} value={option.key}>{option.value}</option>)     
                                    })}
                                </select>
                            </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.author}</div>
                    </div>
                    </li>
                 )})}
            </ol>
            </div>
            </div>
        )
    }


}