export default function PrintInvoice({ orderItems, totalSum, totalMl }) {
  return (
    <>
      <style>{`
  #only-for-print {
    display: none;
  }

  @media print {
    @page {
      margin: 15mm;
    }

    body * {
      visibility: hidden;
      height: 0;
    }

    #only-for-print,
    #only-for-print * {
      visibility: visible !important;
      height: auto !important;
    }

    #only-for-print {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      display: block !important;
      padding: 0;
    }

    /* ---------- ITEMS ---------- */

    .print-item {
      display: flex !important;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      border-bottom: 1px dashed #d1d5db;
      padding: 14px 0;
      break-inside: avoid;
    }

    .print-left {
      flex: 1;
      min-width: 0;
    }

    .print-right {
      width: 130px;
      text-align: right;
      flex-shrink: 0;
    }

    .print-brand {
      font-size: 20px;
      font-weight: 900;
      line-height: 1;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: -0.03em;
      color: #111;
    }

    .print-name {
      font-size: 15px;
      line-height: 1.3;
      color: #6b7280;
      margin: 0;
    }

    .print-price {
      font-size: 26px;
      font-weight: 800;
      line-height: 1;
      margin: 0;
      color: #111;
    }

    .print-meta {
      margin-top: 6px;
      font-size: 10px;
      line-height: 1.4;
      color: #9ca3af;
      font-weight: 700;
      text-transform: uppercase;
    }

    /* ---------- TOTAL ---------- */

    .print-flex {
      display: flex !important;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
    }
  }
`}</style>

      <div id="only-for-print" className="p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#00a693] italic">
            FreshDoze
          </h1>

          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold">
            Ваше замовлення
          </p>
        </div>

        <div className="space-y-4">
          {orderItems.map((item) => (
            <div key={item.id} className="print-item">
              <div className="print-left">
                <h4 className="print-brand">{item.brand}</h4>
                <p className="print-name">{item.name}</p>
              </div>

              <div className="print-right">
                <p className="print-price">{item.totalPrice} ₴</p>

                <p className="print-meta">
                  {item.ml} мл × {item.pricePerMl}₴
                  <br />+ флакон: {item.bottlePrice}₴
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-black">
          <div className="print-flex">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-1">
                Інформація:
              </p>

              <p className="text-sm font-bold">
                Флаконів: {orderItems.length} шт.
              </p>

              <p className="text-sm font-bold">Об'єм: {totalMl} мл</p>
            </div>

            <div className="text-right">
              <p className="text-xl font-black uppercase tracking-tighter">
                Підсумок:
              </p>

              <p className="text-5xl font-black text-[#00a693]">{totalSum} ₴</p>
            </div>
          </div>
          <div className="mt-20 text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em]">
              Дякуємо за замовлення!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
