import { render } from "react-dom"
import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from "./Bookshelf"
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
export default class Search extends React.Component {
    state= {}
   

    handleSearch = (evt) => {
      const {id, value} = evt.target;
      const {onLiveChange} = this.props;
      if (onLiveChange) {
        onLiveChange(value.toLowerCase());
      }
    }

    onBookMove = (book, bookShelfOri,bookShelfDest) => {
      const {onBookMove} = this.props;
      if (onBookMove) {
        onBookMove(book, bookShelfOri,bookShelfDest);
      }
    }

    render() {
        const {results, userBooks, query} = this.props;
        return(
          <div className="search-books">
          <div className="search-books-bar">
            <Link className="close-search" to="/">Close</Link>
            <div className="search-books-input-wrapper">
              <input type="text" value={query} placeholder="Search by title or author" onChange={this.handleSearch}/>
            </div>
          </div>
          <div className="search-books-results">
            <BookShelf 
              title= "Available Books"
              books={results}
              userBooks = {userBooks}
              type="search"
              onBookMove={this.onBookMove}
            />
          </div>
        </div>
        );
    }


}