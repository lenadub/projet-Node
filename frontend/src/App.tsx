import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./HomePage.tsx"
import OrdersPage from "./OrdersPage.tsx"
import CartPage from "./CartPage.tsx"
import Layout from "./Layout.tsx"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App