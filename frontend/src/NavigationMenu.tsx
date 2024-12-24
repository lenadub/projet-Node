import classes from "./NavigationMenu.module.css"
import { Link } from "react-router-dom"

function NavigationMenu() {
  return(
    <ul className={classes.menu}>
      <Link className={classes.menuLink} to="/">Home</Link>
      <Link className={classes.menuLink} to="/orders">Orders</Link>
      <Link className={classes.menuLink} to="/cart">Shopping Cart</Link>
    </ul>
  )
}

export default NavigationMenu