import { useContext } from "react";
import axios from "axios";
import Button from "./Button";
import { AuthContext } from "../context/AuthContext";
import { BookContext } from "../context/BookContext";
import { apiUrl } from "../constants";

const BookmarkCard = ({
  id,
  title,
  author,
  language,
  cover_image,
  rating,
  notes,
  read_date,
  userBooks,
  setUserBooks,
  setShowReviewBook,
}) => {
  const { user } = useContext(AuthContext);
  const { setReviewBook, reviewedBook } = useContext(BookContext);

  const foundReviewedBook = reviewedBook.filter((book) => book.book_id === id);
  const isReviewed = foundReviewedBook.length > 0;

  const handleBookReview = () => {
    setShowReviewBook(true);

    setReviewBook({
      id: id,
      title: title,
      author: author,
      language: language,
      cover_image: cover_image,
      rating: rating,
      notes: notes,
      readDate: read_date,
    });
  };

  const handleRemoveBookmark = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/api/deleteUserBook`, {
        params: { user_id: user.id, book_id: id },
      });

      // Optionally update state to remove the deleted book from the UI
      setUserBooks(userBooks.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  return (
    <div className="w-full rounded-round bg-grayColor p-3 shadow-xl">
      <li className="flex items-center justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <img
            src={cover_image}
            alt={title}
            className="w-[90px] lg:w-[100px]"
          />

          <div className="text-whiteColor">
            <h3 className="text-lg font-medium lg:text-xl">
              <span>{title}</span>
            </h3>
            <p className="text-sm text-secondaryColor lg:text-lg">
              <span>{author}</span>
            </p>
            <p className="text-sm text-whiteColor lg:text-lg">
              <span>{language}</span>
            </p>

            <Button
              text={isReviewed ? "Edit book review" : "Review this book"}
              review={handleBookReview}
            />
          </div>
        </div>

        {/* Bookmark icon */}
        <div className="tooltip">
          <i
            className="bx bxs-bookmark text-3xl text-secondaryColor lg:text-[2rem]"
            onClick={handleRemoveBookmark}
          ></i>
          <span className="tooltiptext ml-[-30px]">Remove bookmark</span>
        </div>
      </li>
    </div>
  );
};

export default BookmarkCard;
