import { useState } from 'react';
import BocaPrintModal from './BocaPrintModal';
import './OrderDetail.css';

/**
 * Order detail page with editable fields and Print. orderId/authCode from props as initial values.
 */
export default function OrderDetail({
  orderId: initialOrderId = 'SP261773127925108',
  orderNumber: initialOrderNumber,
  authCode: initialAuthCode = '',
  printTicketUrl = '',
  localPrintUrl = 'http://localhost:9090/print',
}) {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(initialOrderId || initialOrderNumber || '');
  const [authCode, setAuthCode] = useState(initialAuthCode);

  const displayOrderId = orderId.trim() || 'N/A';

  return (
    <div className="order-detail-page">
      <div className="page-content-header">
        <h1 className="page-title">Order Detail</h1>
        <p className="page-subtitle">View and edit order information, then print Boca tickets.</p>
      </div>

      <div className="order-detail-card">
        <section className="order-form-section">
          <h2 className="section-title">Order Information</h2>
          <div className="order-form-grid">
            <div className="form-group">
              <label htmlFor="order-id-input" className="form-label">
                Order ID / Order Number <span className="required">*</span>
              </label>
              <input
                id="order-id-input"
                type="text"
                className="form-input"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. SP261773127925108"
                autoComplete="off"
                aria-describedby="order-id-hint"
              />
              <span id="order-id-hint" className="form-hint">Editable. Use numeric ID or order number.</span>
            </div>
            <div className="form-group">
              <label htmlFor="auth-code-input" className="form-label">
                Auth Code <span className="required">*</span>
              </label>
              <input
                id="auth-code-input"
                type="text"
                className="form-input"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Paste auth code for API"
                autoComplete="off"
                aria-describedby="auth-code-hint"
              />
              <span id="auth-code-hint" className="form-hint">Editable. Required for print API.</span>
            </div>
          </div>
        </section>

        <div className="order-actions">
          <button
            type="button"
            className="boca-btn boca-btn-primary"
            onClick={() => setPrintModalOpen(true)}
          >
            Print Ticket
          </button>
        </div>
      </div>

      <BocaPrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        orderId={displayOrderId}
        authCode={authCode}
        printTicketUrl={printTicketUrl}
        localPrintUrl={localPrintUrl}
      />
    </div>
  );
}
