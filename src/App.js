import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const API_URL = 'https://fakestoreapi.com';

// Header Component
function Header() {
  const navigate = useNavigate();
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    alert('You have been logged out.');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="logo" />
        </Link>
      </div>
      <nav className="navbar">
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
}

// Utility function for cart management
const addToCart = (product) => {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
  if (!isLoggedIn) {
    alert('You need to log in first to add items to the cart.');
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.push(product);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  alert(`${product.title} has been added to the cart!`);
};

// Login Form Component
function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find((user) => user.email === email && user.password === password);

    if (validUser) {
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      alert('Login successful!');
      navigate('/');
    } else {
      alert('Invalid email or password, or you haven’t signed up yet.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// Signup Form Component
function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      alert('This email is already registered.');
      return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! You can now log in.');
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

// Product Page Component
function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="product-page">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product">
            <Link to={`/product/${product.id}`} className="product-link">
              <img src={product.image} alt={product.title} className="product-image" />
              <h3 className="product-title">{product.title}</h3>
            </Link>
            <p className="product-price">${product.price}</p>
            <button
              className="add-to-cart"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Product Page Component
function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  return (
    <div className="single-product-page">
      {product ? (
        <div className="single-product">
          <img src={product.image} alt={product.title} className="single-product-image" />
          <div className="single-product-details">
            <h2 className="single-product-title">{product.title}</h2>
            <p className="single-product-description">{product.description}</p>
            <p className="single-product-price">${product.price}</p>
            <button
              className="add-to-cart"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

// Cart Page Component
function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    if (!isLoggedIn) {
      alert('Please log in to view your cart.');
      navigate('/login');
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, [navigate]);

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <>
          <div className="product-grid">
            {cart.map((item, index) => (
              <div key={index} className="product">
                <img src={item.image} alt={item.title} className="product-image" />
                <h3 className="product-title">{item.title}</h3>
                <p className="product-price">${item.price}</p>
              </div>
            ))}
          </div>
          <div className="cart-actions">
            <button className="clear-cart" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
    </div>
  );
}

// App Component
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
