// Import necessary hooks from React and CSS module
import { useState, useEffect } from "react";
import classes from "../styles/OrdersPage.module.css";

// Define TypeScript interfaces for order items and orders
interface OrderItem {
  bookId: number;      // Unique identifier for the book
  title: string;       // Book title
  author: string;      // Book author
  cover: string;       // Book cover image URL
  quantity: number;    // Quantity ordered
  price: number;       // Price per item
}

interface Order {
  id: number;          // Unique order identifier
  status: string;      // Order status (e.g. pending, completed)
  items: OrderItem[];  // Array of items in the order
  totalPrice: number;  // Total price of the order
  createdAt: string;   // Order creation timestamp
}

function OrderPage() {
  // State management for orders, loading state and errors
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Async function to get orders data
    const fetchOrders = async () => {
      try {
        // Fetch orders for user with ID 1 for the time being
        // To be changed when users will be handled properly
        const response = await fetch("http://localhost:3000/orders/user/1");

        if (!response.ok) {
          throw new Error("No orders yet.");
        }

        const ordersData = await response.json();

        if (ordersData.length === 0) {
          throw new Error("No orders yet.");
        }

        // Process each order to get full details
        const processedOrders: Order[] = await Promise.all(
            ordersData.map(async (order: any) => {
              // Fetch items for each order
              const orderItemsResponse = await fetch(
                  `http://localhost:3000/order-items/order/${order.id}`
              );

              if (!orderItemsResponse.ok) {
                throw new Error(`Failed to fetch items for order ${order.id}`);
              }

              const itemsData = await orderItemsResponse.json();

              // Get book details for each Order item
              const itemsWithTitles = await Promise.all(
                  itemsData.map(async (item: any) => {
                    const bookResponse = await fetch(
                        `http://localhost:3000/books/reference/${item.book_id}`
                    );

                    if (!bookResponse.ok) {
                      throw new Error(`Failed to fetch book title for reference ${item.book_id}`);
                    }

                    const bookData = await bookResponse.json();
                    return {
                      ...item,  // tip found on 
                      title: bookData.title,
                      author: bookData.author, 
                      cover: bookData.cover,
                    };
                  })
              );

              // Calculate total price for the order
              const totalPrice = parseFloat(
                  itemsWithTitles
                      .reduce(
                          (total: number, item: any) => total + item.price * item.quantity,
                          0
                      )
                      .toFixed(2)
              );

              // Return processed order object
              return {
                id: order.id,  //order id
                status: order.status,
                items: itemsWithTitles,  // order Items
                totalPrice,
                createdAt: order.created_at,
              };
            })
        );

        setOrders(processedOrders); // setOrders =  the state updater created by the useState hook
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []); // 

  // Render orders page based on state above
  return (
      <div className={classes.ordersPage}>
        <h2>Your Orders:</h2>
        {isLoading ? (
            <p>Loading...</p>
        ) : error ? (
            <div className={classes.orders}>{error}</div>
        ) : orders.length === 0 ? (
            <div className={classes.orders}>No orders yet</div>
        ) : (
            // Map through orders and render each order's details
            orders.map((order) => (
                <div key={order.id} className={classes.orderContainer}>
                  <h3>Order #{order.id}</h3>
                  <p>Status: {order.status}</p>
                  <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className={classes.orderItems}>
                    <h4>Items:</h4>
                    {order.items.map((item, index) => (
                        <div key={index} className={classes.orderItem}>
                          <div>
                            <img
                                src={`http://localhost:3000${item.cover}`}
                                alt={item.title}
                                style={{maxWidth: "100px", borderRadius: "6px"}}
                            />
                          </div>
                          <p>Title: {item.title}</p>
                          <p>Author: {item.author}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {item.price} €</p>
                        </div>
                    ))}
                  </div>
                  <p className={classes.totalPrice}>Total Price: {order.totalPrice} €</p>
                </div>
            ))
        )}
      </div>
  );
}

export default OrderPage;
