# Boca Ticket Print – React Front-end

React (Vite) front-end for the Boca ticket print feature: **Print via IP** and **Print via USB**.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173. Click **Print**, choose IP or USB, and submit.

## Backend API

- **POST** `https://dynamicpricing-api.dynamicpricingbuilder.com/BocaPrint/PrintTicket`
- **Body:** `authCode`, `orderId`, `printMethod` ("IP" | "USB"), `printerIP` (for IP), `printerPort` (default 9100)
- **Response:** `errorCode`, `errorMessage`, `sentToPrinter` (IP), `printData` (USB)

For **USB**, the app POSTs `printData` to the local print service (default `http://localhost:9090/print`) with body `{ tickets: printData }`.

## CORS

The browser cannot call the external API directly (CORS). Two options:

1. **Vite proxy (dev):** In `vite.config.js`, `/api/boca` is proxied to the external API. Set `VITE_BOCA_PRINT_TICKET_URL=/api/boca/BocaPrint/PrintTicket` in `.env` so the app calls the proxy (same origin).
2. **Production:** Point `VITE_BOCA_PRINT_TICKET_URL` to your own backend proxy (e.g. Laravel `POST /boca-print/print-ticket`), which forwards to the external API.

## Config (.env)

| Variable | Description |
|----------|-------------|
| `VITE_BOCA_AUTH_CODE` | Auth code for the API |
| `VITE_BOCA_PRINT_TICKET_URL` | Proxy or API URL for PrintTicket (dev: `/api/boca/BocaPrint/PrintTicket`) |
| `VITE_BOCA_LOCAL_PRINT_URL` | Local print service for USB (default `http://localhost:9090/print`) |
| `VITE_ORDER_ID` / `VITE_ORDER_NUMBER` | Demo order id (optional) |

See `.env.example`.

## Project structure

| Path | Description |
|------|-------------|
| `src/App.jsx` | App entry, passes config to OrderDetail |
| `src/components/OrderDetail.jsx` | Order detail page with Print button |
| `src/components/BocaPrintModal.jsx` | Modal: IP/USB choice, form, submit |
| `src/components/BocaPrintModal.css` | Modal styles |
| `src/services/bocaPrintApi.js` | `printTicket()`, `sendToLocalPrintService()` |
| `vite.config.js` | Dev proxy `/api/boca` → external API |

## Using in your app

- **Order detail:** Use `<OrderDetail orderId="..." authCode="..." printTicketUrl="..." localPrintUrl="..." />`. Get `orderId`/`authCode` from your router and auth.
- **Only the modal:** Use `<BocaPrintModal isOpen={...} onClose={...} orderId="..." authCode="..." ... />` and your own Print button.

## Build

```bash
npm run build
```

Output in `dist/`. For production, set env vars when building (e.g. `VITE_BOCA_PRINT_TICKET_URL=https://your-api.com/boca-print/print-ticket`).
