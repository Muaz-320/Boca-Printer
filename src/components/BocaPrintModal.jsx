import { useState, useCallback, useEffect } from 'react';
import { printTicket, sendToLocalPrintService } from '../services/bocaPrintApi';
import './BocaPrintModal.css';

const PRINT_METHOD_IP = 'IP';
const PRINT_METHOD_USB = 'USB';

export default function BocaPrintModal({
  isOpen,
  onClose,
  orderId,
  authCode,
  printTicketUrl = '',
  localPrintUrl = 'http://localhost:9090/print',
}) {
  const [printMethod, setPrintMethod] = useState(PRINT_METHOD_USB);
  const [printerIP, setPrinterIP] = useState('');
  const [printerPort, setPrinterPort] = useState(9100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const hideMessage = useCallback(() => {
    setMessage({ text: '', isError: false });
  }, []);

  const showMessage = useCallback((text, isError) => {
    setMessage({ text, isError });
  }, []);

  const handleMethodChange = (e) => {
    setPrintMethod(e.target.value);
    hideMessage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId || !authCode) {
      showMessage('Order ID and Auth Code are required.', true);
      return;
    }
    if (printMethod === PRINT_METHOD_IP && !printerIP.trim()) {
      showMessage('Printer IP is required for Print via IP.', true);
      return;
    }

    setLoading(true);
    hideMessage();

    try {
      const data = await printTicket({
        authCode,
        orderId,
        printMethod,
        printerIP: printerIP.trim(),
        printerPort: printMethod === PRINT_METHOD_IP ? Number(printerPort) || 9100 : 0,
        printTicketUrl: printTicketUrl || undefined,
      });

      if (data.errorCode !== 0) {
        throw new Error(data.errorMessage || 'Print request failed.');
      }

      if (printMethod === PRINT_METHOD_IP) {
        if (data.sentToPrinter === true) {
          showMessage('Ticket(s) sent to printer successfully.', false);
        } else {
          showMessage(
            data.errorMessage || 'Print may not have reached the printer. Check IP and port.',
            true
          );
        }
        setLoading(false);
        return;
      }

      if (printMethod === PRINT_METHOD_USB) {
        const tickets = data.printData;
        if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
          showMessage('No ticket data received from API.', true);
          setLoading(false);
          return;
        }

        try {
          await sendToLocalPrintService(tickets, localPrintUrl);
          showMessage('Ticket(s) sent to local print service (USB) successfully.', false);
        } catch (err) {
          showMessage(
            err.message || 'Could not reach local print service. Is it running on this PC?',
            true
          );
        }
      }
    } catch (err) {
      showMessage(err.message || 'Print request failed.', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="boca-modal"
      role="dialog"
      aria-labelledby="boca-print-modal-title"
      aria-modal="true"
    >
      <div className="boca-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="boca-modal-dialog">
        <div className="boca-modal-content">
          <div className="boca-modal-header">
            <h2 id="boca-print-modal-title" className="boca-modal-title">
              Print Boca Ticket
            </h2>
            <button
              type="button"
              className="boca-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="boca-modal-body">
            {message.text && (
              <div
                className={`boca-message ${message.isError ? 'is-error' : 'is-success'}`}
                role="alert"
              >
                {message.text}
              </div>
            )}

            <div className="boca-print-options">
              <label className="boca-radio-wrap">
                <input
                  type="radio"
                  name="printMethod"
                  value={PRINT_METHOD_IP}
                  checked={printMethod === PRINT_METHOD_IP}
                  onChange={handleMethodChange}
                />
                <span>Print via IP</span>
              </label>
              <label className="boca-radio-wrap">
                <input
                  type="radio"
                  name="printMethod"
                  value={PRINT_METHOD_USB}
                  checked={printMethod === PRINT_METHOD_USB}
                  onChange={handleMethodChange}
                />
                <span>Print via USB</span>
              </label>
            </div>

            {printMethod === PRINT_METHOD_IP && (
              <div className="boca-ip-fields">
                <div className="boca-field">
                  <label htmlFor="boca-printer-ip">
                    Printer IP <span className="boca-required">*</span>
                  </label>
                  <input
                    id="boca-printer-ip"
                    type="text"
                    value={printerIP}
                    onChange={(e) => setPrinterIP(e.target.value)}
                    placeholder="e.g. 192.168.1.100"
                    className="boca-input"
                    autoComplete="off"
                    aria-label="Printer IP address"
                  />
                </div>
                <div className="boca-field">
                  <label htmlFor="boca-printer-port">Printer Port</label>
                  <input
                    id="boca-printer-port"
                    type="number"
                    value={printerPort}
                    onChange={(e) => setPrinterPort(Number(e.target.value) || 9100)}
                    min={1}
                    max={65535}
                    className="boca-input"
                    autoComplete="off"
                    aria-label="Printer port"
                  />
                </div>
              </div>
            )}

            {printMethod === PRINT_METHOD_USB && (
              <p className="boca-hint">
                USB: Ticket data will be sent to the local print service (e.g. localhost:9090).
              </p>
            )}

            <div className="boca-modal-footer">
              <button type="button" className="boca-btn boca-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="boca-btn boca-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="boca-spinner" aria-hidden />
                    <span className="boca-btn-loading-text">Printing…</span>
                  </>
                ) : (
                  'Print'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
