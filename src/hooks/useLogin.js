import { useEffect, useState } from "react";
import { auth, login, onAuthChange } from "../utils/firebase";

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    onAuthChange(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return {
    isLoggedIn,
    login,
    userName,
  };
};
