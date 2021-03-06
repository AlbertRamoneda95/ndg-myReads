import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import {search} from "./BooksAPI"
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
      currentlyReading: [
        {
          author: "J.K. Rowling",
          title: "Harry Potter and the Half-Blood Prince",
          url: "http://books.google.com/books/content?id=R7YsowJI9-IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        {
          author: "Bonnie Eisenman",
          title: "Learning React Native",
          url: "http://books.google.com/books/content?id=274fCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        }
      ],
      wantToRead:[
        {
          author: "Sean Liao",
          title: "Migrating to Android for iOS Developers",
          url: "http://books.google.com/books/content?id=D1EnCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        {
          author: "J.K. Rowling",
          title: "Harry Potter and the Sorcerer's Stone",
          url:"http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api"
        },
      ],
      read: [   {
        author: "Cassio de Sousa Antonio",
        title: "Pro React",
        url: "http://books.google.com/books/content?id=PKpPCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
      {
        author: "Paul J. Ward",
        title: "Android",
        url: "http://books.google.com/books/content?id=xlp6NE2NWecC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
      {
        author: "Charles A. Knight",
        title: "The Literature of Satire",
        url: "http://books.google.com/books/content?id=SOfVePSFctgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },],
      bookResults:[],
      searchQuery:""
    }
  }

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
    this.setState(prevState => ({
      [destination]: [...prevState[destination], book]
    }));
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
            author:bookEntry.authors ? bookEntry.authors[0]: "",
            title:bookEntry.title,
            url: bookEntry.imageLinks.thumbnail
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
