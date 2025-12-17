import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function SuccessNotification({ message, onClose, duration = 4000 }: SuccessNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-green-200/50 p-5 min-w-[320px] max-w-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Parfait !</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        {/* Barre de progression */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-shrink"
            style={{ animation: `shrink ${duration}ms linear forwards` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

