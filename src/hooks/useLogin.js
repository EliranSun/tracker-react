import { useEffect, useState } from "react";
import { login, auth, onAuthChange } from "../utils/firebase";

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthChange(auth, (user) => {
      if (user) {
        // alert(`Welcome ${user.displayName}!`);
        setIsLoggedIn(true);
      } else {
        // alert("Please login");
        setIsLoggedIn(false);
      }
    });
  }, []);

  return {
    isLoggedIn,
    login,
  };
};
