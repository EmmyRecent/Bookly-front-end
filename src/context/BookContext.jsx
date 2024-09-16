import { createContext, useState } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [reviewBook, setReviewBook] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [reviewedBook, setReviewedBook] = useState([]); // Books that have been reviewed.

  return (
    <BookContext.Provider
      value={{
        books,
        setBooks,
        reviewBook,
        setReviewBook,
        reviewData,
        setReviewData,
        reviewedBook,
        setReviewedBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
