import React, { createContext, useContext, useReducer } from "react";

type CartProviderProps = {
    children: React.ReactNode;
  };

// Définition du type pour un article du panier
interface CartItem {
  id: number;         // ID unique du produit
  name: string;       // Nom du produit
  price: number;      // Prix unitaire
  quantity: number;   // Quantité
}

// Définition de l'état global du panier
interface CartState {
  items: CartItem[];
}

// Définition des actions possibles dans le panier
interface CartAction {
  type: "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY";
  payload: CartItem;
}

// État initial du panier
const initialState: CartState = {
  items: [],
};

// Création du contexte
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({ state: initialState, dispatch: () => undefined });

// Gestionnaire d'état (Reducer) pour le panier
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      // Ajoute un produit au panier
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      // Supprime un produit du panier
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY":
      // Met à jour la quantité d'un produit
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };

    default:
      return state;
  }
};

// Fournisseur du contexte (Provider)
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCart = () => useContext(CartContext);
