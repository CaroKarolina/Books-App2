{
  'use strict';
  
  const select = {
    templateOf: {
      books: '#template-book',
    },
  
    containerOf: {
      booksList: '.books-list',
      bookImage: '.book__image',
      form: '.filters',
      rating: '.book__rating__fill',
    },
  };
  
  const template = {
    book: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;
      console.log(thisBooksList);
      thisBooksList.initData();
      thisBooksList.render();
      thisBooksList.getElement();
      thisBooksList.initActions();
    }

    initData() { // przechowuje dane
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    getElement() { // referencje do el. DOM (czy można je później wykorzystywać ?)
      const thisBooksList = this;
      thisBooksList.dom = {};
      thisBooksList.dom.form = document.querySelector(select.containerOf.form);
      thisBooksList.dom.booksList = document.querySelector(select.containerOf.booksList);
      thisBooksList.dom.rating = document.querySelector(select.containerOf.rating);
    }

    render() {
      const thisBooksList = this;
      for (let book of thisBooksList.data) {
        const booksList = document.querySelector(select.containerOf.booksList);
        const rating = document.querySelector(select.containerOf.rating);
        // console.log(rating);
        const bookRating = book.rating;
        const determineRatingBgcResult = thisBooksList.determineRatingBgc(bookRating);
        const generatedHTML = template.book(book); //uzupełnienie el. HTMLa inf z 'data'
        book = utils.createDOMFromHTML(generatedHTML);
        booksList.appendChild(book);
      }
    }

    initActions() {
      const thisBooksList = this;
      thisBooksList.dom.booksList.addEventListener('dblclick', function(event) {
        event.preventDefault();
        const clickedElement = event.target.offsetParent;
        if (clickedElement.classList.contains('book__image')) {
          const favoriteBookId = clickedElement.getAttribute('data-id');
          if(thisBooksList.favoriteBooks.includes(favoriteBookId)) {
            clickedElement.classList.remove('favorite');
            const unlikeBookId = thisBooksList.favoriteBooks.indexOf(favoriteBookId);
            thisBooksList.favoriteBooks.splice(unlikeBookId, 1);
          } else {
            clickedElement.classList.add('favorite');
            thisBooksList.favoriteBooks.push(favoriteBookId);
          }
        }
      });

      thisBooksList.dom.form.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const inputValue = event.target.value;
        if (clickedElement.type === 'checkbox' 
        && clickedElement.checked) {
          thisBooksList.filters.push(inputValue);
          console.log(thisBooksList.filters);
        } else if (clickedElement.type === 'checkbox' && !clickedElement.checked) {
          const deletedCategory = thisBooksList.filters.indexOf(inputValue);
          thisBooksList.filters.splice(deletedCategory);
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks() {
      const thisBooksList = this;
      for (const book of thisBooksList.data) {
        const bookDetails = book.details;
        let shouldBeHidden = false;
        for (const filter of thisBooksList.filters) {
          if (!bookDetails[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = document.querySelector(`.book__image[data-id="${book.id}"]`);
        if (shouldBeHidden === true) {
          bookImage.classList.add('hidden');
        } else bookImage.classList.remove('hidden');
      }
    }
    
    determineRatingBgc(rating) {
      if (rating < 6) return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      else if (rating >= 6 && rating <= 8) return 'background: linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      else if (rating > 8 && rating <= 9) return 'background: linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      else if (rating > 9) return 'background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
  const app = new BooksList();
  console.log(app);
}