import axios from "axios";
import { faker } from "@faker-js/faker";

export const apiUrl = import.meta.env.VITE_API_URL;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export const coreFeatures = [
  {
    title: "Track Your Reading Journey",
    description:
      "Log every book you’ve read, complete with dates, ratings, and personalized notes to remember key details.",
    icon: "bx bx-run",
  },
  {
    title: "Take Detailed Notes",
    description:
      "Jot down your thoughts and reflections on each book, ensuring you never forget important insights or memorable quotes.",
    icon: "bx bxs-pencil",
  },
  {
    title: "Rate Your Books",
    description:
      "Give each book a rating to help you and others easily assess how much you enjoyed it.",
    icon: "bx bxs-star",
  },
  {
    title: "Organize Your Personal Library",
    description:
      "Sort your book collection by rating, recency, or title, making it simple to navigate through your reading history.",
    icon: "bx bx-sort-up",
  },
  {
    title: "Share Reviews with the Community",
    description:
      "Make your notes and reviews public to share your reading experience with other users in the Booklue community.",
    icon: "bx bxs-share",
  },
  {
    title: "Customizable Profile Page",
    description:
      "Display your reading habits and preferences in an organized and personalized profile that showcases your library.",
    icon: "bx bxs-user",
  },
];

export const upcomingFeatures = [
  {
    title: "Messaging",
    description:
      "Start conversations with friends and fellow readers directly within the app. Share book recommendations, discuss favorite chapters, or plan your next read together!",
    icon: "bx bx-chat",
  },
  {
    title: "Commenting",
    description:
      "Leave comments on your friends’ book reviews and notes, sparking insightful discussions and sharing opinions on your favorite (or least favorite) reads.",
    icon: "bx bxs-comment-detail",
  },
  {
    title: "Likes",
    description:
      "Show appreciation for book reviews or reading progress by liking posts, helping highlight popular opinions and engaging with the community.",
    icon: "bx bxs-heart",
  },
];

export const generateRandomUserProfile = () => {
  const adjectives = [
    "Brave",
    "Clever",
    "Curious",
    "Eager",
    "Mighty",
    "Bold",
    "Gentle",
    "Quick",
    "Swift",
    "Calm",
    "Witty",
    "Silent",
    "Bright",
    "Lucky",
    "Daring",
    "Sharp",
    "Happy",
    "Kind",
    "Smart",
    "Wild",
  ];

  const nouns = [
    "Tiger",
    "Phoenix",
    "Eagle",
    "Wizard",
    "Panther",
    "Wolf",
    "Dragon",
    "Falcon",
    "Bear",
    "Lion",
    "Knight",
    "Viking",
    "Ninja",
    "Samurai",
    "Sage",
    "Hawk",
    "Raven",
    "Fox",
    "Otter",
    "Shark",
  ];

  // Randomly pick one adjective and one noun
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  // Add a random number at the end to ensure uniqueness
  const randomNumber = Math.floor(Math.random() * 10000); // 4 digit random number

  // Generate a  user profile.
  return {
    username: `${randomAdjective}${randomNoun}${randomNumber}`,
    avatar: faker.image.avatar(),
  };
};

export const searchLoader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) return { books: { docs: [] } };

  try {
    const response = await axios.get(`${apiUrl}/api/search`, {
      params: { q: query },
    });

    return { books: response.data };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch books");
  }
};

export const editProfileAction = async ({ request }) => {
  const data = await request.formData();

  const submission = {
    id: data.get("userId"),
    photo: data.get("profileBit"),
    username: data.get("username"),
    name: data.get("name"),
    email: data.get("email"),
    bio: data.get("bio"),
  };

  // Post request to the server.
  try {
    const response = await axios.post(`${apiUrl}/editProfile`, {
      submission,
    });

    return { message: response.data };
  } catch (err) {
    console.error(
      "Error submitting profile details:",
      err.response?.data || err.message,
    );

    if (err.response) {
      return { error: err.response.data.message };
    }

    return {
      error: "An error occurred during profile edit, please try again later.",
    };
  }
};
