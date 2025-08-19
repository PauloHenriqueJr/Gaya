import React, { useState, useEffect } from 'react';
import { WifiIcon, WifiOffIcon, RefreshCwIcon } from 'lucide-react';

const ServiceWorkerStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          setSwRegistration(registration);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end space-y-2">
      {/* Online/Offline Status */}
      <div
        className={`flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-medium ${
          isOnline
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {isOnline ? (
          <>
            <WifiIcon className="h-4 w-4" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOffIcon className="h-4 w-4" />
            <span>Offline</span>
          </>
        )}
      </div>

      {/* Update Available */}
      {updateAvailable && (
        <div className="rounded-lg bg-blue-50 p-3 shadow-lg ring-1 ring-blue-200">
          <div className="flex items-center">
            <RefreshCwIcon className="h-5 w-5 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Atualização disponível
              </p>
              <p className="text-xs text-blue-700">
                Nova versão da plataforma
              </p>
            </div>
          </div>
          <div className="mt-3">
            <button
              type="button"
              className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
              onClick={handleUpdate}
            >
              Atualizar agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceWorkerStatus;