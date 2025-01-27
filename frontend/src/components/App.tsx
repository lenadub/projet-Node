import '../styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import OrdersPage from "./OrdersPage"
import CartPage from "./CartPage"
import Layout from "./Layout"
import BookDetailsPage from "./BookDetailsPage"


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/books/reference/:reference" element={<BookDetailsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
