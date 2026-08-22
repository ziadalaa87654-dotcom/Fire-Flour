import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} toast-show`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
