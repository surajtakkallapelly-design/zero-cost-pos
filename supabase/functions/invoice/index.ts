import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4"

serve(async (req) => {
  // Allow CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  const url = new URL(req.url);
  const num = url.searchParams.get("num");

  if (!num) {
    return new Response("Missing invoice number (?num=INV-XXXX)", { 
      status: 400,
      headers: { "Content-Type": "text/plain" }
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch the order header and line items
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", num)
    .maybeSingle();

  if (error) {
    return new Response(`Database Error: ${error.message}`, { status: 500 });
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/html; charset=utf-8",
  };

  if (!order) {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Not Found</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; }
          h1 { color: #ef4444; font-size: 20px; margin-top: 0; }
          p { color: #64748b; font-size: 14px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Invoice Not Found</h1>
          <p>We couldn't find an invoice matching <strong>${num}</strong>. Please check the URL link and try again.</p>
        </div>
      </body>
      </html>
    `;
    return new Response(errorHtml, { headers: corsHeaders, status: 404 });
  }

  // Render beautiful, printer-friendly invoice
  const formattedDate = new Date(order.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${order.order_number}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f1f5f9;
          color: #1e293b;
          margin: 0;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
        }
        .invoice-card {
          background: #ffffff;
          max-width: 600px;
          margin: 20px auto;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .brand-name {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .receipt-badge {
          background-color: #ecfdf5;
          color: #059669;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          margin-top: 4px;
          display: inline-block;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-num {
          font-weight: 700;
          color: #0f172a;
          font-size: 15px;
        }
        .invoice-date {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
          background-color: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          font-size: 13px;
        }
        .meta-label {
          color: #64748b;
          margin-bottom: 4px;
        }
        .meta-val {
          font-weight: 600;
          color: #0f172a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          padding-bottom: 8px;
          border-bottom: 2px solid #f1f5f9;
        }
        td {
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        .item-name {
          font-weight: 600;
          color: #0f172a;
        }
        .item-qty {
          color: #64748b;
          font-size: 12px;
        }
        .price-col {
          text-align: right;
        }
        .totals-section {
          width: 250px;
          margin-left: auto;
          font-size: 14px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .total-row.grand {
          border-top: 2px solid #f1f5f9;
          padding-top: 12px;
          margin-top: 12px;
          font-weight: 800;
          font-size: 18px;
          color: #059669;
        }
        .footer-note {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px dashed #e2e8f0;
          padding-top: 20px;
        }
        .footer-thanks {
          font-weight: 700;
          color: #475569;
          margin-bottom: 4px;
        }
        @media print {
          body { background-color: #ffffff; padding: 0; }
          .invoice-card { box-shadow: none; border: none; margin: 0; padding: 0; max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div>
            <div class="brand-name">Personal POS</div>
            <div class="receipt-badge">Paid Digital Receipt</div>
          </div>
          <div class="invoice-details">
            <div class="invoice-num">${order.order_number}</div>
            <div class="invoice-date">${formattedDate}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div class="meta-label">Payment Mode</div>
            <div class="meta-val">${order.payment_mode}</div>
          </div>
          <div>
            <div class="meta-label">Customer Mobile</div>
            <div class="meta-val">${order.customer_phone ? '+' + order.customer_phone : 'N/A'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Details</th>
              <th class="price-col">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.order_items || []).map(item => `
              <tr>
                <td>
                  <div class="item-name">${item.product_name}</div>
                  <div class="item-qty">₹${parseFloat(item.unit_price).toFixed(2)} x ${item.quantity} (GST Included)</div>
                </td>
                <td class="price-col font-semibold">₹${parseFloat(item.total_amount).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span style="color: #64748b;">Subtotal</span>
            <span style="font-weight: 600;">₹${parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span style="color: #64748b;">GST Included</span>
            <span style="font-weight: 600;">₹${parseFloat(order.tax_amount).toFixed(2)}</span>
          </div>
          <div class="total-row grand">
            <span>Grand Total</span>
            <span>₹${parseFloat(order.grand_total).toFixed(2)}</span>
          </div>
        </div>

        <div class="footer-note">
          <div class="footer-thanks">Thank you for your business!</div>
          <div>This is a system-generated electronic receipt. No signature required.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return new Response(invoiceHtml, { headers: corsHeaders });
})
