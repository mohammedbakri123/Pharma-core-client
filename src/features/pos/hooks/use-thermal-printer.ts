import { useCallback, useRef, useState } from "react";
import type { PosCheckoutResultDto } from "../types/pos";

interface ThermalPrinterState {
  connected: boolean;
  device: USBDevice | null;
}

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  card: "بطاقة",
};

const LF = 0x0a;
const ESC = 0x1b;
const GS = 0x1d;

function align(n: 0 | 1 | 2) {
  return new Uint8Array([ESC, 0x61, n]);
}

function bold(on: boolean) {
  return new Uint8Array([ESC, 0x45, on ? 1 : 0]);
}

function size(n: number) {
  return new Uint8Array([GS, 0x21, n]);
}

function textLine(t: string) {
  const encoded = new TextEncoder().encode(t);
  const buf = new Uint8Array(encoded.length + 1);
  buf.set(encoded);
  buf[encoded.length] = LF;
  return buf;
}

function dashed(len = 32) {
  return textLine("─".repeat(len));
}

function init() {
  return new Uint8Array([ESC, 0x40]);
}

function cut() {
  return new Uint8Array([GS, 0x56, 0x00]);
}

function feed(n: number) {
  const lines = [];
  for (let i = 0; i < n; i++) lines.push(LF);
  return new Uint8Array(lines);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, b) => s + b.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const b of parts) {
    out.set(b, offset);
    offset += b.length;
  }
  return out;
}

function buildReceipt(receipt: PosCheckoutResultDto): Uint8Array {
  const date = new Date(receipt.createdAt);
  const timeStr = date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("ar-SA", { day: "numeric", month: "numeric", year: "numeric" });

  const lines: Uint8Array[] = [
    init(),
    align(1),
    bold(true),
    size(1),
    textLine("صيدلية"),
    size(0),
    bold(false),
    textLine(`${dateStr} - ${timeStr}`),
    textLine(`فاتورة #${receipt.saleId}`),
    feed(1),
    dashed(),
    align(2),
  ];

  if (receipt.customerName) {
    lines.push(textLine(`العميل: ${receipt.customerName}`));
  }
  if (receipt.userName) {
    lines.push(textLine(`بواسطة: ${receipt.userName}`));
  }

  lines.push(dashed());

  for (const item of receipt.items) {
    lines.push(
      align(2),
      textLine(item.medicineName),
      align(0),
      textLine(`${item.quantity} x ${item.unitPrice.toFixed(2)} = ${item.totalPrice.toFixed(2)}`),
      align(2),
    );
  }

  lines.push(dashed());

  lines.push(
    align(0),
    textLine(`المجموع الفرعي:           ${receipt.subtotal.toFixed(2)} ر.س`),
  );
  if (receipt.discount > 0) {
    lines.push(textLine(`الخصم:                   -${receipt.discount.toFixed(2)} ر.س`));
  }
  lines.push(
    bold(true),
    textLine(`الإجمالي:                 ${receipt.totalAmount.toFixed(2)} ر.س`),
    bold(false),
  );

  lines.push(dashed());

  for (const p of receipt.payments) {
    lines.push(textLine(`${methodLabels[p.method] ?? p.method}  ${p.amount.toFixed(2)} ر.س`));
  }
  lines.push(
    bold(true),
    textLine(`المدفوع:                  ${receipt.paidAmount.toFixed(2)} ر.س`),
    bold(false),
  );
  if (receipt.changeAmount > 0) {
    lines.push(textLine(`الباقي:                   ${receipt.changeAmount.toFixed(2)} ر.س`));
  }

  lines.push(
    align(1),
    feed(1),
    bold(true),
    textLine("شكراً لتعاملكم"),
    bold(false),
    feed(3),
    cut(),
  );

  return concat(lines);
}

export function useThermalPrinter() {
  const [state, setState] = useState<ThermalPrinterState>({ connected: false, device: null });
  const deviceRef = useRef<USBDevice | null>(null);

  const connect = useCallback(async () => {
    if (!navigator.usb) {
      throw new Error("متصفحك لا يدعم WebUSB");
    }

    const device = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x04b8 }, // Epson
        { vendorId: 0x0519 }, // Star Micronics
        { vendorId: 0x1504 }, // Bixolon
        { vendorId: 0x0fe6 }, // Custom / POS-X
      ],
    });

    await device.open();
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    await device.claimInterface(0);

    deviceRef.current = device;
    setState({ connected: true, device });

    return device;
  }, []);

  const disconnect = useCallback(async () => {
    const device = deviceRef.current;
    if (device) {
      try {
        await device.close();
      } catch {
        // ignore
      }
      deviceRef.current = null;
      setState({ connected: false, device: null });
    }
  }, []);

  const print = useCallback(
    async (receipt: PosCheckoutResultDto) => {
      let device = deviceRef.current;

      if (!device) {
        device = await connect();
      }

      const endpoint = device.configuration?.interfaces?.[0]?.alternate?.endpoints?.find(
        (ep) => ep.direction === "out",
      );

      if (!endpoint) {
        throw new Error("لم يتم العثور على منفذ الطباعة");
      }

      const data = buildReceipt(receipt);
      await device.transferOut(endpoint.endpointNumber, data);
    },
    [connect],
  );

  const printOrFallback = useCallback(
    async (receipt: PosCheckoutResultDto) => {
      try {
        await print(receipt);
      } catch (err) {
        const win = window.open("", "_blank", "width=400,height=600");
        if (!win) return;
        win.document.write(buildBrowserReceiptHtml(receipt));
        win.document.close();
        win.focus();
        win.print();
      }
    },
    [print],
  );

  return { state, connect, disconnect, print, printOrFallback };
}

export function buildBrowserReceiptHtml(receipt: PosCheckoutResultDto): string {
  const date = new Date(receipt.createdAt);
  const timeStr = date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("ar-SA", { day: "numeric", month: "numeric", year: "numeric" });

  const itemsHtml = receipt.items
    .map(
      (item) => `
        <tr>
          <td style="text-align:right">${item.medicineName}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:left">${item.unitPrice.toFixed(2)}</td>
          <td style="text-align:left">${item.totalPrice.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const paymentsHtml = receipt.payments
    .map(
      (p) => `
        <tr>
          <td style="text-align:right">${methodLabels[p.method] ?? p.method}</td>
          <td style="text-align:left">${p.amount.toFixed(2)} ر.س</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>فاتورة #${receipt.saleId}</title>
  <style>
    @page { margin: 0; size: 80mm auto; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      font-size: 11px; color: #000; background: #fff;
      width: 72mm; margin: 0 auto; padding: 6px 4px; line-height: 1.6;
    }
    .header { text-align: center; margin-bottom: 4px; }
    .header .name { font-size: 13px; font-weight: bold; }
    .divider { border: none; border-top: 1px dashed #000; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    td { padding: 1px 2px; }
    .row { display: flex; justify-content: space-between; font-size: 10px; }
    .total-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; }
    .footer { text-align: center; margin-top: 6px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">صيدلية</div>
    <div>${dateStr} - ${timeStr}</div>
    <div>فاتورة #${receipt.saleId}</div>
  </div>
  <hr class="divider" />
  ${receipt.customerName ? `<div class="row"><span>العميل:</span><span>${receipt.customerName}</span></div>` : ""}
  ${receipt.userName ? `<div class="row"><span>بواسطة:</span><span>${receipt.userName}</span></div>` : ""}
  <hr class="divider" />
  <table>
    <thead><tr><th style="text-align:right">الصنف</th><th style="text-align:center">الكمية</th><th style="text-align:left">السعر</th><th style="text-align:left">المجموع</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <hr class="divider" />
  <div class="row"><span>المجموع الفرعي</span><span>${receipt.subtotal.toFixed(2)} ر.س</span></div>
  ${receipt.discount > 0 ? `<div class="row"><span>الخصم</span><span>-${receipt.discount.toFixed(2)} ر.س</span></div>` : ""}
  <div class="total-row"><span>الإجمالي</span><span>${receipt.totalAmount.toFixed(2)} ر.س</span></div>
  <hr class="divider" />
  <table><tbody>${paymentsHtml}</tbody></table>
  <div class="row"><span><b>المدفوع</b></span><span><b>${receipt.paidAmount.toFixed(2)} ر.س</b></span></div>
  ${receipt.changeAmount > 0 ? `<div class="row"><span>الباقي</span><span>${receipt.changeAmount.toFixed(2)} ر.س</span></div>` : ""}
  <div class="footer"><hr class="divider" />شكراً لتعاملكم</div>
</body>
</html>`;
}
