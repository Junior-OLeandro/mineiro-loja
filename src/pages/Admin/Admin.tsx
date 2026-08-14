import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Admin.css";

interface OrderItemExtra {
  id: string;
  order_item_id: string;
  extra_id: string | null;
  extra_name: string;
  price: number;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  variant: string | null;
  meat: string | null;
  meat_point: string | null;
  observation: string | null;
  order_item_extras: OrderItemExtra[];
}

interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  neighborhood: string;
  complement: string | null;
  payment_method: string;
  change_for: number | null;
  observation: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

type OrderStatus =
  | "pending"
  | "confirmed"

  | "delivering"
  | "completed";

interface OrderStatusGroup {
  status: OrderStatus;
  title: string;
  description: string;
}

const orderStatusGroups: OrderStatusGroup[] = [
  {
    status: "pending",
    title: "Novos",
    description: "Aguardando confirmação",
  },
  {
    status: "confirmed",
    title: "Confirmados",
    description: "Pedidos confirmados",
  },


  {
    status: "delivering",
    title: "Em entrega",
    description: "Pedidos em rota",
  },
  {
    status: "completed",
    title: "Concluídos",
    description: "Pedidos finalizados",
  },
];



function Admin() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showAllCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
const soundEnabledRef = useRef(false);

const playNewOrderSound = () => {
  if (!soundEnabledRef.current) {
    console.log("🔕 Som ainda não está ativado.");
    return;
  }

  const audio = new Audio("/audio/notification.mp3");

  audio.volume = 1;

  audio.play().catch((error) => {
    console.error("❌ Erro ao tocar novo pedido:", error);
  });
};

const enableSound = () => {
  const audio = new Audio("/audio/notification.mp3");

  audio.volume = 1;

  audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;

      soundEnabledRef.current = true;
      setSoundEnabled(true);

      console.log("🔔 SOM ATIVADO COM SUCESSO");
    })
    .catch((error) => {
      console.error("❌ ERRO AO ATIVAR SOM:", error);
      alert(
        "Não foi possível ativar o som. Verifique se o arquivo notification.mp3 está em public/audio."
      );
    });
};


  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setCheckingAuth(false);
    }

    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (checkingAuth) {
      return;
    }

    async function loadOrders() {
      setLoadingOrders(true);
      setOrdersError("");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            order_item_extras (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar pedidos:", error);
        setOrdersError("Não foi possível carregar os pedidos.");
        setLoadingOrders(false);
        return;
      }

      setOrders((data as Order[]) ?? []);
      setLoadingOrders(false);
    }

    loadOrders();
  }, [checkingAuth]);

  async function loadOrderById(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          order_item_extras (*)
        )
      `)
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Erro ao carregar pedido:", error);
      return null;
    }

    return data as Order;
  }

  useEffect(() => {
    if (checkingAuth) {
      return;
    }

    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("🟢 NOVO PEDIDO:", payload.new);

          playNewOrderSound();

          const newOrder = await loadOrderById(payload.new.id);

          if (!newOrder) {
            return;
          }

          setOrders((currentOrders) => {
            const alreadyExists = currentOrders.some(
              (order) => order.id === newOrder.id,
            );

            if (alreadyExists) {
              return currentOrders;
            }

            return [newOrder, ...currentOrders];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("🔵 PEDIDO ATUALIZADO:", payload.new);

          const updatedOrder = await loadOrderById(payload.new.id);

          if (!updatedOrder) {
            return;
          }

          setOrders((currentOrders) =>
            currentOrders
              .map((order) =>
                order.id === updatedOrder.id
                  ? updatedOrder
                  : order,
              )
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              ),
          );

          setSelectedOrder((currentOrder) =>
            currentOrder?.id === updatedOrder.id
              ? updatedOrder
              : currentOrder,
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("🔴 PEDIDO REMOVIDO:", payload.old);

          const deletedOrderId = payload.old.id;

          setOrders((currentOrders) =>
            currentOrders.filter(
              (order) => order.id !== deletedOrderId,
            ),
          );

          setSelectedOrder((currentOrder) =>
            currentOrder?.id === deletedOrderId
              ? null
              : currentOrder,
          );
        },
      )
      .subscribe((status) => {
        console.log("STATUS REALTIME:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [checkingAuth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  function openWhatsApp(order: Order) {
    const phone = order.customer_phone.replace(/\D/g, "");

    const normalizedPhone = phone.startsWith("55")
      ? phone
      : `55${phone}`;

    const message = encodeURIComponent(
      `Olá, ${order.customer_name}! Aqui é da Mineiro. Estou falando sobre o pedido #${order.order_number}.`,
    );

    window.open(
      `https://wa.me/${normalizedPhone}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function printOrder(order: Order) {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Não foi possível abrir a janela de impressão.");
      return;
    }

    const createdAt = new Date(order.created_at).toLocaleString(
      "pt-BR",
    );

    const itemsHtml = order.order_items
      .map((item) => {
        const extrasHtml =
          item.order_item_extras &&
            item.order_item_extras.length > 0
            ? item.order_item_extras
              .map(
                (extra) => `
                    <p style="margin: 2px 0 2px 12px;">
                      + ${extra.extra_name}
                      ${Number(extra.price) > 0
                    ? ` - R$ ${Number(extra.price).toFixed(2)}`
                    : ""
                  }
                    </p>
                  `,
              )
              .join("")
            : "";

        return `
          <div style="margin-bottom: 8px;">
            <p class="line">
              <span>
                ${item.quantity}x ${item.product_name}
              </span>

              <span>
                R$ ${(Number(item.unit_price) * item.quantity).toFixed(2)}
              </span>
            </p>

            ${item.variant
            ? `<p style="margin: 2px 0 2px 12px;">Variante: ${item.variant}</p>`
            : ""
          }

            ${item.meat
            ? `<p style="margin: 2px 0 2px 12px;">Carne: ${item.meat}</p>`
            : ""
          }

            ${item.meat_point
            ? `<p style="margin: 2px 0 2px 12px;">Ponto: ${item.meat_point}</p>`
            : ""
          }

            ${extrasHtml}

            ${item.observation
            ? `<p style="margin: 2px 0 2px 12px;">Obs.: ${item.observation}</p>`
            : ""
          }
          </div>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Pedido #${order.order_number}</title>

          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            body {
              width: 80mm;
              margin: 0;
              padding: 10px;
              font-family: Arial, sans-serif;
              font-size: 12px;
              color: #000;
            }

            h1 {
              margin: 0 0 4px;
              text-align: center;
              font-size: 20px;
            }

            h2 {
              margin: 10px 0 4px;
              font-size: 14px;
              border-bottom: 1px dashed #000;
              padding-bottom: 3px;
            }

            p {
              margin: 3px 0;
              line-height: 1.35;
            }

            .center {
              text-align: center;
            }

            .total {
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1px dashed #000;
              font-size: 16px;
              font-weight: bold;
            }

            .line {
              display: flex;
              justify-content: space-between;
              gap: 8px;
            }
          </style>
        </head>

        <body>
          <h1>Mineiro</h1>

          <p class="center">
            Pedido #${order.order_number}
          </p>

          <p class="center">
            ${createdAt}
          </p>

          <h2>Cliente</h2>

          <p><strong>${order.customer_name}</strong></p>
          <p>${order.customer_phone}</p>

          <h2>Entrega</h2>

          <p>${order.address}</p>
          <p>${order.neighborhood}</p>

          ${order.complement
        ? `<p>${order.complement}</p>`
        : ""
      }

          <h2>Pagamento</h2>

          <p>${order.payment_method}</p>

          ${order.change_for !== null
        ? `<p>Troco para: R$ ${Number(order.change_for).toFixed(2)}</p>`
        : ""
      }

          ${order.observation
        ? `
                <h2>Observação</h2>
                <p>${order.observation}</p>
              `
        : ""
      }

          <h2>Itens</h2>

          ${itemsHtml}

          <h2>Valores</h2>

          <p class="line">
            <span>Subtotal</span>
            <span>R$ ${Number(order.subtotal).toFixed(2)}</span>
          </p>

          <p class="line">
            <span>Entrega</span>
            <span>R$ ${Number(order.delivery_fee).toFixed(2)}</span>
          </p>

          <p class="line total">
            <span>Total</span>
            <span>R$ ${Number(order.total).toFixed(2)}</span>
          </p>

          <p class="center" style="margin-top: 14px;">
            Status: ${order.status}
          </p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  }

  async function updateOrderStatus(
    order: Order,
    status: OrderStatus,
  ) {
    if (updatingStatus) {
      return;
    }

    setUpdatingStatus(true);

    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .select(`
        *,
        order_items (
          *,
          order_item_extras (*)
        )
      `)
      .single();

    if (error) {
      console.error("Erro ao atualizar pedido:", error);
      alert("Não foi possível atualizar o status do pedido.");
      setUpdatingStatus(false);
      return;
    }

    const updatedOrder = data as Order;

    setOrders((currentOrders) =>
      currentOrders
        .map((currentOrder) =>
          currentOrder.id === order.id
            ? updatedOrder
            : currentOrder,
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        ),
    );

    setSelectedOrder(updatedOrder);
    setUpdatingStatus(false);
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "pending":
        return "Novo";
      case "confirmed":
        return "Confirmado";
      case "preparing":
        return "Em preparo";
      case "ready":
        return "Pronto";
      case "delivering":
        return "Em entrega";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  }

  function getOrdersByStatus(status: OrderStatus) {
    return orders.filter((order) => order.status === status);
  }


  function getVisibleOrdersByStatus(status: OrderStatus) {
    const statusOrders = getOrdersByStatus(status);

    if (status === "completed" && !showAllCompleted) {
      return statusOrders.slice(0, 5);
    }

    return statusOrders;
  }

  if (checkingAuth) {
    return <main>Verificando acesso...</main>;
  }

  const newOrders = getOrdersByStatus("pending").length;



  const deliveringOrders =
    getOrdersByStatus("delivering").length;


  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <h1>Mineiro</h1>
            <p>Painel administrativo</p>
          </div>
          <button
            className="admin-sound-button"
            type="button"
            onClick={enableSound}
          >
            {soundEnabled ? "🔔 Som ativado" : "🔕 Ativar som"}
          </button>
          <button
            className="admin-logout"
            type="button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-welcome">
          <h2>Pedidos</h2>
          <p>Gerencie os pedidos recebidos pela Mineiro.</p>
        </div>

        <section className="admin-summary">
          <article
            className={`admin-summary-card ${newOrders > 0 ? "admin-summary-card-new" : ""
              }`}
          >
            <span>Novos</span>
            <strong>{newOrders}</strong>

            {newOrders > 0 && (
              <small>Pedidos aguardando confirmação</small>
            )}
          </article>



          <article className="admin-summary-card">
            <span>Saiu para entrega</span>
            <strong>{deliveringOrders}</strong>
          </article>


        </section>

        <section className="admin-orders">
          <div className="admin-orders-header">
            <div>
              <h3>Pedidos por status</h3>
              <p>
                Acompanhe os pedidos conforme o andamento.
              </p>
            </div>

            {newOrders > 0 && (
              <div className="admin-new-order-indicator">
                <span className="admin-new-order-dot" />
                {newOrders === 1
                  ? "1 novo pedido"
                  : `${newOrders} novos pedidos`}
              </div>
            )}
          </div>

          {loadingOrders && <p>Carregando pedidos...</p>}

          {!loadingOrders && ordersError && (
            <p>{ordersError}</p>
          )}

          {!loadingOrders &&
            !ordersError &&
            orders.length === 0 && (
              <p>Nenhum pedido encontrado.</p>
            )}

          {!loadingOrders &&
            !ordersError &&
            orders.length > 0 && (
              <div className="admin-status-board">
                {orderStatusGroups.map((group) => {
                  const statusOrders = getVisibleOrdersByStatus(
                    group.status,
                  );

                  return (
                    <section
                      className={`admin-status-column ${group.status === "pending"
                        ? "admin-status-column-new"
                        : ""
                        }`}
                      key={group.status}
                    >
                      <div className="admin-status-column-header">
                        <div>
                          <h4>{group.title}</h4>
                          <p>{group.description}</p>
                        </div>

                        <div>
                          <span className="admin-status-count">
                            {getOrdersByStatus(group.status).length}
                          </span>

                          {group.status === "completed" &&
                            getOrdersByStatus("completed").length > 5 && (
                              <button
                                type="button"
                                onClick={() => navigate("/admin/pedidos")}
                              >
                                Ver histórico
                              </button>
                            )}
                        </div>
                      </div>

                      {statusOrders.length === 0 ? (
                        <div className="admin-status-empty">
                          Nenhum pedido
                        </div>
                      ) : (
                        <div className="admin-orders-list">
                          {statusOrders.map((order) => {
                            const isNew =
                              order.status === "pending";

                            return (
                              <article
                                className={`admin-order-card ${isNew
                                  ? "admin-order-card-new"
                                  : ""
                                  }`}
                                key={order.id}
                                onClick={() =>
                                  setSelectedOrder(order)
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    setSelectedOrder(order);
                                  }
                                }}
                              >
                                {isNew && (
                                  <div className="admin-new-order-badge">
                                    <span className="admin-new-order-dot" />
                                    NOVO PEDIDO
                                  </div>
                                )}

                                <div className="admin-order-info">
                                  <strong>
                                    Pedido #
                                    {order.order_number}
                                  </strong>

                                  <p>
                                    {order.customer_name}
                                  </p>

                                  <span className="admin-order-time">
                                    {new Date(
                                      order.created_at,
                                    ).toLocaleTimeString(
                                      "pt-BR",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </span>
                                </div>

                                <div className="admin-order-main">
                                  <div className="admin-order-values">
                                    <strong>
                                      R${" "}
                                      {Number(
                                        order.total,
                                      ).toFixed(2)}
                                    </strong>

                                    <span
                                      className={`admin-status-badge admin-status-${order.status}`}
                                    >
                                      {getStatusLabel(
                                        order.status,
                                      )}
                                    </span>
                                  </div>

                                  <div
                                    className="admin-order-actions"
                                    onClick={(event) =>
                                      event.stopPropagation()
                                    }
                                  >
                                    <button
                                      className="admin-action-button admin-whatsapp"
                                      type="button"
                                      onClick={() =>
                                        openWhatsApp(order)
                                      }
                                    >
                                      WhatsApp
                                    </button>

                                    <button
                                      className="admin-action-button admin-print"
                                      type="button"
                                      onClick={() =>
                                        printOrder(order)
                                      }
                                    >
                                      Imprimir
                                    </button>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
        </section>
      </section>

      {selectedOrder && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Pedido #${selectedOrder.order_number}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h2>
                  Pedido #{selectedOrder.order_number}
                </h2>

                <p>
                  {new Date(
                    selectedOrder.created_at,
                  ).toLocaleString("pt-BR")}
                </p>
              </div>

              <button
                className="admin-modal-close"
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-content">
              <section className="admin-detail-section">
                <h3>Cliente</h3>

                <p>
                  <strong>
                    {selectedOrder.customer_name}
                  </strong>
                </p>

                <p>{selectedOrder.customer_phone}</p>
              </section>

              <section className="admin-detail-section">
                <h3>Entrega</h3>

                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.neighborhood}</p>

                {selectedOrder.complement && (
                  <p>{selectedOrder.complement}</p>
                )}
              </section>

              <section className="admin-detail-section">
                <h3>Pagamento</h3>

                <p>{selectedOrder.payment_method}</p>

                {selectedOrder.change_for !== null && (
                  <p>
                    Troco para: R${" "}
                    {Number(
                      selectedOrder.change_for,
                    ).toFixed(2)}
                  </p>
                )}
              </section>

              {selectedOrder.observation && (
                <section className="admin-detail-section">
                  <h3>Observação</h3>
                  <p>{selectedOrder.observation}</p>
                </section>
              )}

              <section className="admin-detail-section">
                <h3>Itens do pedido</h3>

                {selectedOrder.order_items &&
                  selectedOrder.order_items.length > 0 ? (
                  <div className="admin-order-items">
                    {selectedOrder.order_items.map((item) => (
                      <div
                        className="admin-order-item"
                        key={item.id}
                      >
                        <div className="admin-order-item-header">
                          <strong>
                            {item.quantity}x{" "}
                            {item.product_name}
                          </strong>

                          <strong>
                            R${" "}
                            {(
                              Number(item.unit_price) *
                              item.quantity
                            ).toFixed(2)}
                          </strong>
                        </div>

                        {item.variant && (
                          <p>
                            <strong>Variante:</strong>{" "}
                            {item.variant}
                          </p>
                        )}

                        {item.meat && (
                          <p>
                            <strong>Carne:</strong>{" "}
                            {item.meat}
                          </p>
                        )}

                        {item.meat_point && (
                          <p>
                            <strong>Ponto:</strong>{" "}
                            {item.meat_point}
                          </p>
                        )}

                        {item.order_item_extras &&
                          item.order_item_extras.length > 0 && (
                            <div className="admin-order-item-extras">
                              <strong>Adicionais:</strong>

                              {item.order_item_extras.map(
                                (extra) => (
                                  <p key={extra.id}>
                                    + {extra.extra_name}

                                    {Number(extra.price) >
                                      0 && (
                                        <>
                                          {" "}
                                          — R${" "}
                                          {Number(
                                            extra.price,
                                          ).toFixed(2)}
                                        </>
                                      )}
                                  </p>
                                ),
                              )}
                            </div>
                          )}

                        {item.observation && (
                          <p>
                            <strong>
                              Observação:
                            </strong>{" "}
                            {item.observation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>
                    Nenhum item encontrado neste pedido.
                  </p>
                )}
              </section>

              <section className="admin-detail-section">
                <h3>Valores</h3>

                <div className="admin-value-row">
                  <span>Subtotal</span>
                  <strong>
                    R${" "}
                    {Number(
                      selectedOrder.subtotal,
                    ).toFixed(2)}
                  </strong>
                </div>

                <div className="admin-value-row">
                  <span>Taxa de entrega</span>
                  <strong>
                    R${" "}
                    {Number(
                      selectedOrder.delivery_fee,
                    ).toFixed(2)}
                  </strong>
                </div>

                <div className="admin-value-row admin-total-row">
                  <span>Total</span>
                  <strong>
                    R${" "}
                    {Number(
                      selectedOrder.total,
                    ).toFixed(2)}
                  </strong>
                </div>
              </section>

              <section className="admin-detail-section">
                <h3>Status</h3>

                <p className="admin-current-status">
                  {getStatusLabel(selectedOrder.status)}
                </p>

                <div className="admin-status-actions">
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() =>
                      updateOrderStatus(
                        selectedOrder,
                        "confirmed",
                      )
                    }
                  >
                    Confirmar
                  </button>



                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() =>
                      updateOrderStatus(
                        selectedOrder,
                        "delivering",
                      )
                    }
                  >
                    Saiu para entrega
                  </button>

                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() =>
                      updateOrderStatus(
                        selectedOrder,
                        "completed",
                      )
                    }
                  >
                    Concluído
                  </button>
                </div>
              </section>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-action-button admin-whatsapp"
                type="button"
                onClick={() => openWhatsApp(selectedOrder)}
              >
                Falar no WhatsApp
              </button>

              <button
                className="admin-action-button admin-print"
                type="button"
                onClick={() =>
                  printOrder(selectedOrder)
                }
              >
                Imprimir pedido
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Admin;
