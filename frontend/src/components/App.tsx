import '../styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import OrdersPage from "./OrdersPage"
import CartPage from "./CartPage"
import BookDetailsPage from "./BookDetailsPage"
import Layout from "./Layout"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
