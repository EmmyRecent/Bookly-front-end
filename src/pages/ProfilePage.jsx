import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, useActionData, useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import axios from "axios";
import BookmarkCard from "../components/BookmarkCard";
import ReviewBook from "../components/ReviewBook";
import ReviewedBookCard from "../components/ReviewedBookCard";
import { BookContext } from "../context/BookContext";
import ErrorMessage from "../components/ErrorMessage";
import { apiUrl } from "../constants";

const ProfilePage = () => {
  const data = useActionData();
  const body = document.querySelector("body");
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const { reviewedBook, setReviewedBook } = useContext(BookContext);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showReviewBook, setShowReviewBook] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [sortBy, setSortBy] = useState("Title");
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false); // Track error and message visibility.
  const [errorMessage, setErrorMessage] = useState("");
  const [sortReviewBy, setSortReviewBy] = useState("Title");

  useEffect(() => {
    if (data?.error) {
      setErrorMessage(data.error);
      setIsVisible(true); // Show the error.

      const timer = setTimeout(() => {
        setIsVisible(false); // start fade out.
        setTimeout(() => setErrorMessage(""), 500); // Clear error after fade out.
      }, 5000); // wait 3 secs before starting fade-out

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts.
    }
  }, [data]);

  useEffect(() => {
    if (errorMessage) {
      setIsVisible(true); // Show the error.

      const timer = setTimeout(() => {
        setIsVisible(false); // start fade out.
        setTimeout(() => setErrorMessage(""), 500); // Clear error after fade out.
      }, 4000); // wait 3 secs before starting fade-out

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts.
    }
  }, [errorMessage]);

  const handleClick = () => {
    setShowEditProfile(true);
  };

  if (showEditProfile || showReviewBook) {
    body.classList.add("modal-open");
  } else {
    body.classList.remove("modal-open");
  }

  // Handle user logout.
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/logout`,
        {},
        { withCredentials: true },
      );

      if (response.status === 200) {
        setIsAuthenticated(false);
        setUser(null);

        // Redirect the user to the login page.
        navigate("/account/login");
      } else {
        console.error("Failed to log out:", response.data);
      }
    } catch (err) {
      console.error("Error logging user out:", err);
    }
  };

  const handleChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortReviewBy(e.target.value);
  };

  // A function to handle the error message of review books.
  const handleReviewError = (message) => {
    setErrorMessage(message);
  };

  // Updating the user data when profile has been edited.
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${apiUrl}/user`, {
          params: { email: user.email },
        });

        setUser(result.data.user);
      } catch (err) {
        console.error("Error updating user:", err);
      }
    };
    getUser();
  }, [data, setUser, user.email]);

  // Get users books.
  useEffect(() => {
    const getUserBooks = async () => {
      try {
        const result = await axios.get(`${apiUrl}/api/getUserBooks`, {
          params: { id: user.id, sort: sortBy },
        });

        setUserBooks(result.data.data);
      } catch (err) {
        console.error("Error getting user books:", err);
      }
    };

    getUserBooks();
  }, [user.id, sortBy]);

  // Get users reviewed books.
  useEffect(() => {
    const getReviewedBook = async () => {
      try {
        const result = await axios.get(`${apiUrl}/api/getUserReviewedBooks`, {
          params: { id: user.id, sort: sortReviewBy },
        });

        setReviewedBook(result.data.data);
      } catch (err) {
        console.error("Error getting user reviewed books:", err);
      }
    };

    getReviewedBook();
  }, [user.id, setReviewedBook, userBooks, sortReviewBy]);

  return (
    <section>
      <div className="wrapper">
        <div className="py-10">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-start">
            {user.profile_picture ? (
              <img
                className="rounded-[100%]"
                width={130}
                height={130}
                src={user.profile_picture}
                alt="Profile Picture"
              />
            ) : (
              <i className="bx bxs-user-circle text-[90px] text-secondaryColor lg:text-[100px]"></i>
            )}

            <div className="flex flex-col gap-1 text-whiteColor lg:gap-2">
              <h3 className="text-xl lg:text-2xl">{user.name || "Add name"}</h3>
              <p className="text-sm lg:text-lg">
                @{user.username || "Add username"}
              </p>
              <p className="text-lg lg:text-xl">{user.email}</p>

              <div
                className="mx-auto flex cursor-pointer gap-2 whitespace-nowrap rounded-round bg-lightGrayColor p-2 text-lg md:mx-0 md:mr-auto lg:text-xl"
                onClick={handleClick}
              >
                <i className="bx bx-edit text-lg"></i>
                <p>Edit profile</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-whiteColor lg:text-lg">
            {user.bio || "No bio yet"}
          </p>
        </div>

        <div className="py-7 lg:py-10">
          <div className="flex flex-col items-start justify-between gap-2 text-xl ll:flex-row ll:items-center lg:text-2xl">
            <h4 className="text-whiteColor">Books read</h4>

            <div className="flex items-center justify-center gap-2">
              <span className="text-whiteColor">Sort by:</span>

              <Form>
                <label htmlFor="Sort by"></label>

                <select name="sort" value={sortBy} onChange={handleChange}>
                  <option value="Title">Title</option>
                  <option value="Author">Author</option>
                  <option value="added_at">Date</option>
                </select>
              </Form>
            </div>
          </div>

          {/* Read books  */}
          <div className="flex min-h-[30vh] flex-col justify-center">
            {userBooks.length === 0 ? (
              <p className="justify-self-center text-center text-2xl text-lightGrayColor">
                No books read
              </p>
            ) : (
              <ul className="flex flex-col gap-4 py-8">
                {userBooks.map((book, index) => (
                  <BookmarkCard
                    {...book}
                    key={index}
                    userBooks={userBooks}
                    setUserBooks={setUserBooks}
                    setShowReviewBook={setShowReviewBook}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col items-start justify-between gap-2 text-xl ll:flex-row ll:items-center lg:text-2xl">
            <h4 className="text-whiteColor">Books reviewed</h4>

            <div className="flex items-center justify-center gap-2">
              <span className="text-whiteColor">Sort by:</span>

              <Form>
                <label htmlFor="Sort by"></label>

                <select
                  name="sortReview"
                  onChange={handleSortChange}
                  value={sortReviewBy}
                >
                  <option value="Title">Title</option>
                  <option value="Author">Author</option>
                  <option value="read_date">Date</option>
                  <option value="rating">Rating</option>
                </select>
              </Form>
            </div>
          </div>

          {/* Reviewed books  */}
          <div className="flex min-h-[30vh] flex-col justify-center">
            {reviewedBook.length === 0 ? (
              <p className="justify-self-center text-center text-2xl text-lightGrayColor">
                No books reviewed
              </p>
            ) : (
              <ul className="grid grid-cols-1 justify-items-center gap-4 py-8 max-[480px]:place-items-center sm:grid-cols-2 lg:grid-cols-3">
                {reviewedBook.map((book, index) => (
                  <ReviewedBookCard key={index} {...book} />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`overlay pb-[20px] pt-[20px] ${showEditProfile ? "show" : ""}`}
        >
          <EditProfile close={() => setShowEditProfile(false)} />
        </div>

        <div
          className={`overlay pb-[20px] pt-[20px] ${showReviewBook ? "show" : ""}`}
        >
          <ReviewBook
            close={() => setShowReviewBook(false)}
            reviewError={handleReviewError}
          />
        </div>

        <div
          className="my-8 inline-block cursor-pointer rounded-round bg-secondaryColor px-4 py-2"
          onClick={handleLogout}
        >
          <p className="text-[1rem] font-medium text-whiteColor lg:text-lg">
            Log out
          </p>
        </div>

        {errorMessage && (
          <ErrorMessage message={errorMessage} isVisible={isVisible} />
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
