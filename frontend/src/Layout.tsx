import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import NavigationMenu from "./NavigationMenu";

interface LayoutProps {
  children: React.ReactNode; // Typage de la propriété children
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <NavigationMenu />
      {children}
      <Footer />
    </>
  );
};

export default Layout;