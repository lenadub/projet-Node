// import classes from "../styles/OrdersPage.module.css"
//
// function OrdersPage() {
//   return(
//     <div className={classes.orders}>No orders yet</div>
//   )
// }
//
// export default OrdersPage

import { useState, useEffect } from "react";
import classes from "../styles/OrdersPage.module.css";

interface OrderItem {
  bookId: number;
  title: string;
  author: string;
  cover: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string; // Assuming the API returns the creation date
}

function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/orders/user/1");

        if (!response.ok) {
          throw new Error("No orders yet.");
        }

        const ordersData = await response.json();

        if (ordersData.length === 0) {
          throw new Error("No orders yet.");
        }

        const processedOrders: Order[] = await Promise.all(
            ordersData.map(async (order: any) => {
              const orderItemsResponse = await fetch(
                  `http://localhost:3000/order-items/order/${order.id}`
              );

              if (!orderItemsResponse.ok) {
                throw new Error(`Failed to fetch items for order ${order.id}`);
              }

              const itemsData = await orderItemsResponse.json();

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
                      ...item,
                      title: bookData.title,
                      author: bookData.author,
                      cover: bookData.cover,
                    };
                  })
              );

              const totalPrice = parseFloat(
                  itemsWithTitles
                      .reduce(
                          (total: number, item: any) => total + item.price * item.quantity,
                          0
                      )
                      .toFixed(2)
              );

              return {
                id: order.id,
                status: order.status,
                items: itemsWithTitles,
                totalPrice,
                createdAt: order.created_at,
              };
            })
        );

        setOrders(processedOrders);
        setError(null); // Clear any previous error
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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



