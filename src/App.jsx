import Layout from './components/Layout';
import OrderDetail from './components/OrderDetail';

/**
 * Config: use env vars or override here.
 * For dev with Vite proxy (avoids CORS): set printTicketUrl to /api/boca/BocaPrint/PrintTicket
 */
const config = {
  orderId: import.meta.env.VITE_ORDER_ID || 'SP261773127925108',
  orderNumber: import.meta.env.VITE_ORDER_NUMBER || undefined,
  authCode: import.meta.env.VITE_BOCA_AUTH_CODE || 'd063d05b-fbb1-4bf0-b4d8-b2f603454858',
  printTicketUrl:
    import.meta.env.VITE_BOCA_PRINT_TICKET_URL || '/api/boca/BocaPrint/PrintTicket',
  localPrintUrl:
    import.meta.env.VITE_BOCA_LOCAL_PRINT_URL || 'http://localhost:9090/print',
};

export default function App() {
  return (
    <Layout>
      <OrderDetail
        orderId={config.orderId}
        orderNumber={config.orderNumber}
        authCode={config.authCode}
        printTicketUrl={config.printTicketUrl}
        localPrintUrl={config.localPrintUrl}
      />
    </Layout>
  );
}
