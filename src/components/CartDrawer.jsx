import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const { showToast } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      showToast('🎉 Order placed successfully! Your food is on its way.', 'success', 5000);
      clearCart();
    }, 1500);
  };

  return (
    <>
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark" 
        style={{ opacity: 0.5, zIndex: 1050 }}
        onClick={closeCart}
      />

      <div 
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
        style={{ 
          width: 'min(100%, 420px)', 
          zIndex: 1051,
          backgroundColor: '#faf8f3',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-2">
            <h4 className="mb-0 fw-bold font-serif" style={{ color: '#171714' }}>Your Order</h4>
            <span className="badge bg-danger rounded-pill px-2 py-1">{cartCount} items</span>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={() => { setOrderComplete(false); closeCart(); }}
          />
        </div>

        <div className="flex-grow-1 overflow-auto p-4">
          {orderComplete ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '48px' }}>🍕</div>
              <h4 className="fw-bold text-success mb-2">Thank You!</h4>
              <p className="text-muted small mb-4">Your order has been received and is being prepared in our wood-fired oven.</p>
              <button 
                className="btn btn-outline-dark" 
                onClick={() => { setOrderComplete(false); closeCart(); }}
              >
                Back to Menu
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-5 my-4">
              <div className="mb-3 text-muted" style={{ fontSize: '40px' }}>🛒</div>
              <h5 className="fw-semibold text-dark">Your cart is empty</h5>
              <p className="text-muted small mb-4">Looks like you haven't added any dishes yet.</p>
              <button className="btn btn-danger btn-sm px-4" onClick={closeCart}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="card border-0 shadow-sm p-3 position-relative"
                  style={{ background: '#fff', borderRadius: '10px' }}
                >
                  <div className="d-flex gap-3 align-items-center">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                    <div className="flex-grow-1 me-2">
                      <h6 className="mb-1 fw-bold text-dark">{item.name}</h6>
                      <div className="text-danger fw-semibold small">€{Number(item.price).toFixed(2)}</div>
                    </div>
                    
                    <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                      <button 
                        className="btn btn-sm p-0 border-0 text-muted px-1"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-2 small fw-bold">{item.quantity}</span>
                      <button 
                        className="btn btn-sm p-0 border-0 text-muted px-1"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="btn btn-link text-muted p-0 ms-2 text-decoration-none"
                      style={{ fontSize: '18px' }}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!orderComplete && cartItems.length > 0 && (
          <div className="p-4 border-top bg-white">
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Subtotal</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Delivery Fee</span>
              <span className="text-success fw-semibold">FREE</span>
            </div>
            <div className="d-flex justify-content-between mb-4 h5 fw-bold text-dark border-top pt-2">
              <span>Total</span>
              <span className="text-danger">€{cartTotal.toFixed(2)}</span>
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-danger btn-lg fw-bold py-3"
                style={{ backgroundColor: '#b72d20', borderColor: '#b72d20', borderRadius: '8px' }}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Processing Order...
                  </>
                ) : (
                  `Checkout • €${cartTotal.toFixed(2)}`
                )}
              </button>
              <button 
                className="btn btn-link text-muted btn-sm text-decoration-none"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
