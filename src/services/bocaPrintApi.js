/**
 * Boca Print API – PrintTicket + local print service (USB).
 * Use printTicketUrl for proxy (avoids CORS) or apiBaseUrl for direct call.
 */

const defaultPrintTicketUrl =
  import.meta.env.VITE_BOCA_PRINT_TICKET_URL ||
  (import.meta.env.VITE_BOCA_API_BASE_URL
    ? `${import.meta.env.VITE_BOCA_API_BASE_URL.replace(/\/$/, '')}/BocaPrint/PrintTicket`
    : '');

const defaultLocalPrintUrl =
  import.meta.env.VITE_BOCA_LOCAL_PRINT_URL || 'http://localhost:9090/print';

/**
 * @param {Object} options
 * @param {string} options.authCode
 * @param {string} options.orderId
 * @param {'IP'|'USB'} options.printMethod
 * @param {string} [options.printerIP]
 * @param {number} [options.printerPort]
 * @param {string} [options.printTicketUrl] - proxy or direct API URL
 */
export async function printTicket({
  authCode,
  orderId,
  printMethod,
  printerIP = '',
  printerPort = 0,
  printTicketUrl = defaultPrintTicketUrl,
}) {
  const url = printTicketUrl || `${(import.meta.env.VITE_BOCA_API_BASE_URL || '').replace(/\/$/, '')}/BocaPrint/PrintTicket`;
  if (!url) throw new Error('Print ticket URL not configured.');

  const body = {
    authCode: String(authCode),
    orderId: String(orderId),
    printMethod,
    printerIP: printMethod === 'IP' ? String(printerIP || '') : '',
    printerPort: printMethod === 'IP' ? (Number(printerPort) || 9100) : 0,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_BOCA_CSRF_TOKEN && {
        'X-CSRF-TOKEN': import.meta.env.VITE_BOCA_CSRF_TOKEN,
        'X-Requested-With': 'XMLHttpRequest',
      }),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.errorMessage || `Request failed: ${res.status} ${res.statusText}`);
  }
  return data;
}

/**
 * Send ticket data to local print service (USB).
 * @param {Array} tickets - array of ticket objects from API printData
 * @param {string} [localPrintUrl]
 */
export async function sendToLocalPrintService(tickets, localPrintUrl = defaultLocalPrintUrl) {
  const res = await fetch(localPrintUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickets }),
  });
  if (!res.ok) {
    throw new Error(`Local print service error: ${res.status}. Is it running on this PC?`);
  }
  return res;
}
