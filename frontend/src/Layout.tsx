import Header from "./Header.tsx"
import Footer from "./Footer.tsx"
import NavigationMenu from "./NavigationMenu.tsx"

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