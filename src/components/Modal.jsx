import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Modal() {
  const { modalState, closeModal } = useApp();
  const { isOpen, title, content } = modalState;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close modal" onClick={closeModal}>
          &times;
        </button>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">
          {typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
