// import classes from '../styles/Header.module.css'
// Importing necessary hooks from React
//
// function Header() {
//   return(
//     <div className={classes.header}>header</div>
//   )
// }
//
// export default Header

// Importing necessary hooks from React
import { useState, useEffect } from "react";
// Importing CSS module for styling the Header component
import classes from '../styles/Header.module.css';

// Defining the Header behavior
function Header() {
  // State to hold the username, initialized to null
  const [username, setUsername] = useState<string | null>(null);

  // useEffect hook to get user data when the component mounts
  useEffect(() => {
    //  function to get user data
    const fetchUser = async () => {
      try {
        // Fetching user data from backend API 
        // UserId to be updated when users are handled by frontend
        const response = await fetch("http://localhost:3000/users/1"); 

        if (!response.ok) {
          throw new Error("Failed to fetch user data."); 
        }

        const userData = await response.json();
        // Updating the username state with the retrieved  username
        setUsername(userData.username);
      } catch (error) {
        console.error(error);
      }
    };

    // Calling the fetchUser function to initiate the data fetching
    fetchUser();
  }, []);

  return (
      <div className={classes.header}>
        <div>BookShelf Store</div>
        {/* Displaying the username or a loading message if the username is not yet available */}
        <div className={classes.username}>username: {username ? username : "Loading..."}</div>
      </div>
  );
}

// Exporting the Header component for use in other parts of the application
export default Header;



