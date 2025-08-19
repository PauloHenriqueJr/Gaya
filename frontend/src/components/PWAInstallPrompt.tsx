import React, { useState, useEffect } from 'react';
import { DownloadIcon, XIcon } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    setIsInStandaloneMode(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Set a flag to not show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed, dismissed this session, or in standalone mode
  if (
    !showInstallPrompt ||
    isInStandaloneMode ||
    sessionStorage.getItem('pwa-install-dismissed')
  ) {
    return null;
  }

  return (
    <>
      {/* Standard PWA Install Prompt */}
      {deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
          <div className="rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <DownloadIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Instalar GaiaSystem
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Acesse rapidamente nossa plataforma de gestão ambiental
                    </p>
                  </div>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    onClick={handleDismiss}
                  >
                    <span className="sr-only">Fechar</span>
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                  onClick={handleDismiss}
                >
                  Agora não
                </button>
                <button
                  type="button"
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                  onClick={handleInstallClick}
                >
                  Instalar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Instructions */}
      {isIOS && showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
          <div className="rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <DownloadIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Instalar no iOS
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Toque em{' '}
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-gray-100 text-xs">
                        ↗
                      </span>{' '}
                      e depois "Adicionar à Tela Inicial"
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-4 flex flex-shrink-0 rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={handleDismiss}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;