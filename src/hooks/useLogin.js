import { useEffect, useState } from "react";
import { login, auth, onAuthStateChanged } from "../utils/firebase";

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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
    login
  };
}