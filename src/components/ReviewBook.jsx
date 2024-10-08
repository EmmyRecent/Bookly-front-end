import { useContext, useState } from "react";
import Button from "./Button";
import { Form } from "react-router-dom";
import { BookContext } from "../context/BookContext";
import StarRating from "./StarRating";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { apiUrl } from "../constants";

const ReviewBook = ({ close, reviewError }) => {
  const { reviewBook, setReviewedBook } = useContext(BookContext);
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(reviewBook.rating); // come back here.
  const [dateRead, setDateRead] = useState(reviewBook.readDate);
  const [note, setNote] = useState(reviewBook.notes);

  const handleReviewBook = async () => {
    const reviewData = {
      userId: user.id,
      bookId: reviewBook.id,
      title: reviewBook.title,
      author: reviewBook.author,
      rating: rating,
      dateRead: dateRead,
      notes: note,
      reviewed: true,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/updateReviewBooks`,
        reviewData,
      );

      setReviewedBook(response.data.data);
    } catch (err) {
      console.error("Failed to add Review Books!", err);

      if (err.response) {
        console.log(err.response.data.message); // Come back to this.
        reviewError(err.response.data.message);
      }
    }

    setDateRead("");
    setNote("");
    setRating("");
  };

  // TODO: FIX: Look at the date reviewed the date is displaying the date read 1 day behind the actual date the user read that book.

  return (
    <div className="mx-4 h-full w-full bg-transparent text-whiteColor lg:max-w-[700px]">
      <Form className="relative rounded-round bg-lightGrayColor p-8">
        <div className="flex items-center justify-between pb-6">
          <p className="text-xl lg:text-2xl">Review Book</p>
          <i className="bx bx-x cursor-pointer text-3xl" onClick={close}></i>
        </div>

        <hr className="absolute left-0 right-0 bg-whiteColor" />

        <div className="flex items-center justify-between py-6">
          <h3 className="editText text-xl font-medium">Book Title:</h3>

          <p className="mx-auto text-lg">{reviewBook.title}</p>
        </div>

        <hr className="absolute left-0 right-0 bg-whiteColor" />

        <div className="flex items-center justify-between py-6">
          <h3 className="editText text-xl font-medium">Book Author:</h3>

          <p className="mx-auto text-lg">{reviewBook.author}</p>
        </div>

        <hr className="absolute left-0 right-0 bg-whiteColor" />

        <div className="flex items-center justify-between py-6">
          <h3 className="editText text-xl font-medium">Your Rating:</h3>

          <div className="mx-auto">
            <StarRating rating={rating} setRating={setRating} />
          </div>
        </div>

        <hr className="absolute left-0 right-0 bg-whiteColor" />

        <div className="flex items-center justify-between py-6">
          <h3 className="editText text-xl font-medium">Date Read:</h3>

          <input
            type="date"
            className="mx-auto"
            value={dateRead}
            onChange={(e) => setDateRead(e.target.value)}
          />
        </div>

        <hr className="absolute left-0 right-0 bg-whiteColor" />

        <div className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <p className="editText">Note:</p>

          <div className="mx-auto flex w-full max-w-[400px] flex-col">
            <textarea
              type="text"
              className="mb-2 w-full resize-y px-4 py-2 text-blackColor"
              name="Note"
              placeholder="Notes"
              rows={10}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <hr className="absolute left-0 right-0 bg-whiteColor" />

        <div className="pt-6">
          <div className="flex items-center justify-end gap-4">
            <div
              className="cursor-pointer rounded-round bg-secondaryColor px-10 py-2 text-whiteColor"
              onClick={close}
            >
              <p>Cancel</p>
            </div>

            <Button text={"Save"} click={close} reviewSave={handleReviewBook} />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ReviewBook;
