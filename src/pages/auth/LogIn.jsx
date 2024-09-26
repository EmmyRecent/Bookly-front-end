import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { google } from "../../assets/icons";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/successMessage";
import { apiUrl } from "../../constants";

const LogIn = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false); // Track error and message visibility.
  // A state to track the message from the server.
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputValue((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const submission = {
      email: inputValue.email,
      password: inputValue.password,
    };

    try {
      const response = await axios.post(`${apiUrl}/login`, submission, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setSuccessMessage("Login successful!");

        navigate("/profile");
      }

      console.log("Unexpected response:", response);
    } catch (err) {
      console.error("Error submitting login details", err);

      if (err.response) {
        console.log(err.response.data.error);
        setErrorMessage(err.response.data.error);
      }
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setIsVisible(true); // Show the error.

      const timer = setTimeout(() => {
        setIsVisible(false); // start fade out.
        setTimeout(() => setErrorMessage(""), 500); // Clear error after fade out.
      }, 5000); // wait 3 secs before starting fade-out

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts.
    }

    if (successMessage) {
      setIsVisible(true); // Show the error.

      const timer = setTimeout(() => {
        setIsVisible(false); // start fade out.
        setTimeout(() => successMessage(""), 500); // Clear error after fade out.
      }, 4000); // wait 3 secs before starting fade-out

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts.
    }
  }, [errorMessage, successMessage]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <form
        method="post"
        className="wrapper rounded-round border border-secondaryColor px-4 py-8 shadow-2xl lg:max-w-[50%] lg:p-8"
      >
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4">
              <div className="input-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="text"
                  name="email"
                  value={inputValue.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={inputValue.password}
                  onChange={handleChange}
                  placeholder="Your password"
                />
              </div>
            </div>

            <Button text="Login" login={handleLogin} />

            {errorMessage && (
              <ErrorMessage message={errorMessage} isVisible={isVisible} />
            )}

            {successMessage && (
              <SuccessMessage message={successMessage} isVisible={isVisible} />
            )}
          </div>

          {/* OR line */}
          <div className="relative flex items-center justify-center py-2 lg:h-[200px] lg:py-0">
            <div className="absolute z-10 h-[1px] w-full bg-secondaryColor lg:inset-0 lg:m-auto lg:h-full lg:w-[1px]" />
            <div className="z-20 rounded-[50%] border border-secondaryColor bg-primaryColor p-[10px] font-medium text-whiteColor">
              OR
            </div>
          </div>

          <div className="flex cursor-pointer gap-2 self-center rounded-round bg-whiteColor p-2">
            <img src={google} alt="google icon" width={24} height={24} />
            <p>Login with google</p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-whiteColor lg:text-lg">
          haven&apos;t got an account?{" "}
          <Link
            to={"/account/register"}
            className="cursor-pointer text-secondaryColor"
          >
            click here to sign up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LogIn;
