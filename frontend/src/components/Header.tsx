// import classes from '../styles/Header.module.css'
//
// function Header() {
//   return(
//     <div className={classes.header}>header</div>
//   )
// }
//
// export default Header

import { useState, useEffect } from "react";
import classes from '../styles/Header.module.css';

function Header() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/1"); // Replace 1 with dynamic user ID if needed

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const userData = await response.json();
        setUsername(userData.username);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
      <div className={classes.header}>
        <div>BookShelf Store</div>
        <div className={classes.username}>username: {username ? username : "Loading..."}</div>
      </div>
  );
}

export default Header;

