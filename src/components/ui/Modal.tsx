'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-full overflow-auto pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
                {title && (
                  <h2 id="modal-title" className="text-xl font-semibold">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto p-2 hover:bg-[var(--color-bg-alt)] rounded transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
