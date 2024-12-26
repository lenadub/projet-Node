import classes from "../styles/NavigationMenu.module.css"
import { NavLink } from "react-router-dom"

function NavigationMenu() {
  return(
    <ul className={classes.menu}>
      <NavLink className={( {isActive} ) => isActive ? classes.activeLink : classes.menuLink} to="/">Home</NavLink>
      <NavLink className={( {isActive} ) => isActive ? classes.activeLink : classes.menuLink} to="/orders">Orders</NavLink>
      <NavLink className={( {isActive} ) => isActive ? classes.activeLink : classes.menuLink} to="/cart">Shopping Cart</NavLink>
    </ul>
  )
}

export default NavigationMenu
