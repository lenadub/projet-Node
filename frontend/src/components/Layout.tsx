import Header from "./Header.js"
import Footer from "./Footer.js"
import NavigationMenu from "./NavigationMenu.js"

function Layout({children}) {
  return(
    <>
      <Header />
      <NavigationMenu />
      {children}
      <Footer />
    </>
  )
}

export default Layout
