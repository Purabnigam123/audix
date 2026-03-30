import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import { getAdminMe, getAdminOrders } from "../api/api";

const ADMIN_TOKEN_KEY = "adminToken";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

      if (!adminToken) {
        setAuthChecked(true);
        navigate("/admin/login");
        return;
      }

      try {
        await getAdminMe(adminToken);
        const orderData = await getAdminOrders(adminToken);
        setOrders(orderData.orders || []);
      } catch (error) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setOrders([]);
        navigate("/admin/login");
      } finally {
        setAuthChecked(true);
      }
    };

    loadOrders();
  }, [navigate]);

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) || null;

  const downloadReceipt = (order) => {
    if (!order) return;

    const doc = new jsPDF();
    const marginLeft = 14;
    let y = 16;

    const customerName = order.user?.name || "N/A";
    const phone = order.phone || order.user?.phone || "N/A";
    const address = order.shippingAddress || order.user?.address || "N/A";

    doc.setFontSize(18);
    doc.text("AUDIX - Order Receipt", marginLeft, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(`Order ID: ${order.id}`, marginLeft, y);
    y += 7;
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      marginLeft,
      y,
    );
    y += 7;
    doc.text(`Customer: ${customerName}`, marginLeft, y);
    y += 7;
    doc.text(`Phone: ${phone}`, marginLeft, y);
    y += 7;
    doc.text(`Address: ${address}`, marginLeft, y);
    y += 7;
    doc.text(`Payment Mode: ${order.paymentMode || "N/A"}`, marginLeft, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Items", marginLeft, y);
    y += 7;

    doc.setFontSize(11);
    (order.items || []).forEach((item, index) => {
      const itemName = item.product?.name || "Unknown Item";
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.price || 0);
      const lineTotal = unitPrice * quantity;

      const line = `${index + 1}. ${itemName} | Qty: ${quantity} | Unit: Rs ${unitPrice.toFixed(
        2,
      )} | Total: Rs ${lineTotal.toFixed(2)}`;
      doc.text(line, marginLeft, y);
      y += 7;
    });

    y += 4;
    doc.setFontSize(12);
    doc.text(
      `Grand Total: Rs ${Number(order.totalAmount || 0).toFixed(2)}`,
      marginLeft,
      y,
    );

    doc.save(`receipt-${order.id.slice(-8).toLowerCase()}.pdf`);
  };

  if (!authChecked) {
    return null;
  }

  return (
    <section className="surface-panel rounded-2xl p-6 !shadow-none">
      <h1 className="section-title text-3xl text-white">Orders</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Address</th>
              <th className="pb-3">Payment Mode</th>
              <th className="pb-3">Total Price</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="border-t border-white/10 text-slate-300">
                <td className="py-4" colSpan={8}>
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() =>
                    setSelectedOrderId((prev) =>
                      prev === order.id ? null : order.id,
                    )
                  }
                  className="cursor-pointer border-t border-white/10 text-slate-200 transition hover:bg-white/5"
                >
                  <td className="py-3 text-xs">
                    {order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3">{order.user?.name || "N/A"}</td>
                  <td className="py-3">
                    {order.phone || order.user?.phone || "N/A"}
                  </td>
                  <td className="py-3 max-w-[300px] truncate">
                    {order.shippingAddress || order.user?.address || "N/A"}
                  </td>
                  <td className="py-3">{order.paymentMode}</td>
                  <td className="py-3">
                    Rs {Number(order.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <article className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">
              Order Details #{selectedOrder.id.slice(-8).toUpperCase()}
            </h3>
            <button
              type="button"
              onClick={() => downloadReceipt(selectedOrder)}
              className="btn-primary rounded-lg px-4 py-2 text-xs font-semibold"
            >
              Download Receipt (PDF)
            </button>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            <p>
              <span className="text-slate-400">Name:</span>{" "}
              {selectedOrder.user?.name || "N/A"}
            </p>
            <p>
              <span className="text-slate-400">Phone:</span>{" "}
              {selectedOrder.phone || selectedOrder.user?.phone || "N/A"}
            </p>
            <p className="md:col-span-2">
              <span className="text-slate-400">Address:</span>{" "}
              {selectedOrder.shippingAddress ||
                selectedOrder.user?.address ||
                "N/A"}
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="text-slate-400">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Quantity</th>
                  <th className="pb-2">Unit Price</th>
                  <th className="pb-2">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {(selectedOrder.items || []).map((item, index) => {
                  const quantity = Number(item.quantity || 0);
                  const unitPrice = Number(item.price || 0);
                  const lineTotal = quantity * unitPrice;

                  return (
                    <tr
                      key={`${selectedOrder.id}-${index}`}
                      className="border-t border-white/10 text-slate-200"
                    >
                      <td className="py-2">
                        {item.product?.name || "Unknown Item"}
                      </td>
                      <td className="py-2">{quantity}</td>
                      <td className="py-2">Rs {unitPrice.toFixed(2)}</td>
                      <td className="py-2">Rs {lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm font-semibold text-white">
            Total: Rs {Number(selectedOrder.totalAmount || 0).toFixed(2)}
          </p>
        </article>
      )}
    </section>
  );
};

export default AdminOrdersPage;
