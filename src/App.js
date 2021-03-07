import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import {search, getAll, update} from "./BooksAPI"
import BookShelf from "./Bookshelf"
import Search from "./Search"
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyReading: [],
      wantToRead:[],
      read: [],
      bookResults:[],
      searchQuery:""
    }
  }


  componentDidMount = (() => {
    
    getAll().then((results)=> {
      results.map(bookEntry => {
        var parsedBook= {
          id:bookEntry.id,
          author:bookEntry.authors ? bookEntry.authors[0]: "",
          title:bookEntry.title,
          url: bookEntry.imageLinks.thumbnail
        };
        this.setState(prevState => ({
          [bookEntry.shelf]: [...prevState[bookEntry.shelf], parsedBook]
        }));
      });
    })
  });
  onBookMove = ((book, bookShelfOri,bookShelfDest) => {
    this.deleteBookFromOrigin(book, bookShelfOri);
    this.addBookToDestination(book, bookShelfDest);
  });

  deleteBookFromOrigin = ((book, origin) => {
    if (origin !== "none") {
      let bookshelfData = this.state[origin];
      bookshelfData = bookshelfData.filter(bookElement => {
        return bookElement.author !== book.author ? true : false;
      });
      this.setState({
        [origin] : bookshelfData
      });
    }
  });

  addBookToDestination = ((book, destination) => {
    update(book, destination).then(() => {
      this.setState(prevState => ({
        [destination]: [...prevState[destination], book]
      }));
    });
  });

  onLiveChange = (newValue) => {
    this.setState({
      searchQuery : newValue
    });
    search(newValue).then(results => {
      var parsedResults = [];
      if (results && results.length) {
        results.map(bookEntry => {
          parsedResults.push({
            id:bookEntry.id,
            author:bookEntry.authors ? bookEntry.authors[0]: "",
            title:bookEntry.title,
            url:  bookEntry.imageLinks ? bookEntry.imageLinks.thumbnail : ""
          });
  
        });
      }
      this.setState({
        bookResults : parsedResults
      });
    });
  };

  render() {
    const {searchQuery, bookResults, currentlyReading, wantToRead, read} = this.state;
    const userBooks = {
      "currentlyReading":currentlyReading,
      "wantToRead": wantToRead,
      "read": read
    }
    return (
      <div className="app">
        <Router>
          <Route path="/search">
           <Search 
            query= {searchQuery}
            results={bookResults}
            userBooks = {userBooks}
            onLiveChange={this.onLiveChange} 
            onBookMove={this.onBookMove}/>
          </Route>
          <Route exact path="/">
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <BookShelf 
                    title= "Currently Reading"
                    books={currentlyReading}
                    type="currentlyReading"
                    onBookMove={this.onBookMove}
                  />
                  <BookShelf
                    title= "Want to Read"
                    books={wantToRead}
                    type="wantToRead"
                    onBookMove={this.onBookMove}
                  />
                  <BookShelf
                    title= "Read"
                    books={read}
                    type="read"
                    onBookMove={this.onBookMove}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link to="/Search">Add a book</Link>
              </div>
            </div>
          </Route>
        </Router>
      </div>
    )
  }
}

export default BooksApp
