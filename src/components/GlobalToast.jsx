import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const EVENT_NAME = 'app:toast';

export function showGlobalToast(message, type = 'success') {
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: { message, type },
    })
  );
}

export default function GlobalToast() {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const timerRef = useRef(null);

  useEffect(() => {
    const onToast = (event) => {
      const { message, type = 'success' } = event.detail || {};
      if (!message) return;

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      setToast({ visible: true, message, type });
      timerRef.current = window.setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 1800);
    };

    window.addEventListener(EVENT_NAME, onToast);
    return () => {
      window.removeEventListener(EVENT_NAME, onToast);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!toast.visible) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-lg backdrop-blur-sm text-sm font-medium ${
          isError
            ? 'bg-rose-50/95 text-rose-700 border-rose-200'
            : 'bg-emerald-50/95 text-emerald-700 border-emerald-200'
        }`}
      >
        {isError ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        {toast.message}
      </div>
    </div>
  );
}
