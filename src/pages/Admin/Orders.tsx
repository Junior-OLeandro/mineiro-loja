import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Order.css";

interface OrderItemExtra {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  extras: OrderItemExtra[];
  observation?: string;
  variant?: "simples" | "duplo" | "triplo";
  meat?: "boi" | "frango";
  meatPoint?: "malpassado" | "ao-ponto" | "bem-passado";
}

interface Order {
  id: string;
  order_number: number;

  customer_name: string;
  customer_phone: string;

  payment_method: string;

  address?: string;
  neighborhood?: string;
  neighborhood_id?: string;
  complement?: string;

  items?: OrderItem[];

  observation?: string;
  change_for?: number;

  subtotal?: number;
  delivery_fee?: number;
  total: number;

  status: string;
  created_at: string;
}

interface SupabaseOrderExtra {
  id: string;
  extra_id: string;
  extra_name: string;
  price: number;
}

interface SupabaseOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  variant: string | null;
  meat: string | null;
  meat_point: string | null;
  observation: string | null;
  order_item_extras: SupabaseOrderExtra[];
}

interface SupabaseOrder {
  id: string;
  order_number: number;

  customer_name: string;
  customer_phone: string;

  payment_method: string;

  address: string | null;
  neighborhood: string | null;
  complement: string | null;

  observation: string | null;
  change_for: number | null;

  subtotal: number | null;
  delivery_fee: number | null;
  total: number;

  status: string;
  created_at: string;

  order_items: SupabaseOrderItem[];
}

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            unit_price,
            variant,
            meat,
            meat_point,
            observation,
            order_item_extras (
              id,
              extra_id,
              extra_name,
              price
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar histórico:", error);

        setError("Não foi possível carregar os pedidos.");
        setLoading(false);

        return;
      }

      const formattedOrders: Order[] =
        ((data as SupabaseOrder[]) ?? []).map((order) => ({
          id: order.id,
          order_number: order.order_number,

          customer_name: order.customer_name,
          customer_phone: order.customer_phone,

          payment_method: order.payment_method,

          address: order.address ?? undefined,
          neighborhood: order.neighborhood ?? undefined,
          complement: order.complement ?? undefined,

          observation: order.observation ?? undefined,
          change_for: order.change_for ?? undefined,

          subtotal: order.subtotal ?? undefined,
          delivery_fee: order.delivery_fee ?? undefined,
          total: order.total,

          status: order.status,
          created_at: order.created_at,

          items: (order.order_items ?? []).map((item) => ({
            id: item.id,

            productId: item.product_id,
            name: item.product_name,

            unitPrice: Number(item.unit_price),
            quantity: item.quantity,

            variant:
              item.variant === "simples" ||
                item.variant === "duplo" ||
                item.variant === "triplo"
                ? item.variant
                : undefined,

            meat:
              item.meat === "boi" ||
                item.meat === "frango"
                ? item.meat
                : undefined,

            meatPoint:
              item.meat_point === "malpassado" ||
                item.meat_point === "ao-ponto" ||
                item.meat_point === "bem-passado"
                ? item.meat_point
                : undefined,

            observation:
              item.observation ?? undefined,

            extras: (item.order_item_extras ?? []).map(
              (extra) => ({
                id: extra.id,
                name: extra.extra_name,
                price: Number(extra.price),
              }),
            ),
          })),
        }));

      setOrders(formattedOrders);
      setLoading(false);
    }

    loadOrders();
  }, []);

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

      case "cancelled":
        return "Cancelado";

      default:
        return status;
    }
  }

  function getPaymentLabel(paymentMethod: string) {
    switch (paymentMethod) {
      case "pix":
        return "Pix";

      case "cash":
        return "Dinheiro";

      case "card":
        return "Cartão";

      default:
        return paymentMethod;
    }
  }

  function getMeatLabel(meat?: string) {
    switch (meat) {
      case "boi":
        return "Boi";

      case "frango":
        return "Frango";

      default:
        return "";
    }
  }

  function getMeatPointLabel(meatPoint?: string) {
    switch (meatPoint) {
      case "malpassado":
        return "Malpassado";

      case "ao-ponto":
        return "Ao ponto";

      case "bem-passado":
        return "Bem passado";

      default:
        return "";
    }
  }

  function getVariantLabel(variant?: string) {
    switch (variant) {
      case "simples":
        return "Simples";

      case "duplo":
        return "Duplo";

      case "triplo":
        return "Triplo";

      default:
        return "";
    }
  }

  function formatCurrency(value?: number) {
    return `R$ ${Number(value ?? 0)
      .toFixed(2)
      .replace(".", ",")}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function closeModal() {
    setSelectedOrder(null);
  }

  const filteredOrders = orders.filter((order) => {
    // =========================
    // NOME
    // =========================

    const matchesName = order.customer_name
      .toLowerCase()
      .includes(nameFilter.toLowerCase().trim());

    // =========================
    // TELEFONE
    // =========================

    const orderPhone = order.customer_phone.replace(/\D/g, "");
    const filterPhone = phoneFilter.replace(/\D/g, "");

    const matchesPhone = orderPhone.includes(filterPhone);

    // =========================
    // BAIRRO
    // =========================

    const matchesNeighborhood = (
      order.neighborhood ?? ""
    )
      .toLowerCase()
      .includes(neighborhoodFilter.toLowerCase().trim());

    // =========================
    // PERÍODO
    // =========================

    let matchesPeriod = true;

    if (periodFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const now = new Date();

      if (periodFilter === "today") {
        matchesPeriod =
          orderDate.toDateString() === now.toDateString();
      }

      if (periodFilter === "7days") {
        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(now.getDate() - 7);

        matchesPeriod = orderDate >= sevenDaysAgo;
      }

      if (periodFilter === "30days") {
        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(now.getDate() - 30);

        matchesPeriod = orderDate >= thirtyDaysAgo;
      }
    }

    return (
      matchesName &&
      matchesPhone &&
      matchesNeighborhood &&
      matchesPeriod
    );
  });

  return (
    <main className="admin-orders-page">
      {/* =========================
          HEADER
      ========================= */}

      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <h1>Mineiro</h1>

            <p>Histórico de pedidos</p>
          </div>

          <button
            className="admin-logout"
            type="button"
            onClick={() => navigate("/admin")}
          >
            Voltar
          </button>
        </div>
      </header>

      {/* =========================
          CONTEÚDO
      ========================= */}

      <section className="admin-content">
        <div className="admin-welcome">
          <h2>Histórico de pedidos</h2>

          <p>
            Consulte todos os pedidos recebidos pela Mineiro.
          </p>
        </div>

        <div className="orders-filters">
          <div className="orders-filter-group">
            <label htmlFor="period-filter">
              Período
            </label>

            <select
              id="period-filter"
              value={periodFilter}
              onChange={(event) =>
                setPeriodFilter(event.target.value)
              }
            >
              <option value="all">
                Todos os períodos
              </option>

              <option value="today">
                Hoje
              </option>

              <option value="7days">
                Últimos 7 dias
              </option>

              <option value="30days">
                Últimos 30 dias
              </option>
            </select>
          </div>

          <div className="orders-filter-group">
            <label htmlFor="name-filter">
              Nome do cliente
            </label>

            <input
              id="name-filter"
              type="text"
              placeholder="Digite o nome..."
              value={nameFilter}
              onChange={(event) =>
                setNameFilter(event.target.value)
              }
            />
          </div>

          <div className="orders-filter-group">
            <label htmlFor="phone-filter">
              Telefone
            </label>

            <input
              id="phone-filter"
              type="text"
              placeholder="Digite o telefone..."
              value={phoneFilter}
              onChange={(event) =>
                setPhoneFilter(event.target.value)
              }
            />
          </div>

          <div className="orders-filter-group">
            <label htmlFor="neighborhood-filter">
              Bairro
            </label>

            <input
              id="neighborhood-filter"
              type="text"
              placeholder="Digite o bairro..."
              value={neighborhoodFilter}
              onChange={(event) =>
                setNeighborhoodFilter(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="orders-clear-filters"
            onClick={() => {
              setPeriodFilter("all");
              setNameFilter("");
              setPhoneFilter("");
              setNeighborhoodFilter("");
            }}
          >
            Limpar filtros
          </button>
        </div>

        <div className="orders-results-count">
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1
            ? "pedido encontrado"
            : "pedidos encontrados"}
        </div>

        {loading && <p>Carregando pedidos...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p>Nenhum pedido encontrado.</p>
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <p>Nenhum pedido corresponde aos filtros.</p>
          )}

        {!loading && !error && orders.length > 0 && (
          <div className="admin-history-list">
            {filteredOrders.map((order) => (
              <article
                className="admin-history-card"
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setSelectedOrder(order);
                  }
                }}
              >
                {/* LADO ESQUERDO */}

                <div>
                  <strong>
                    Pedido #{order.order_number}
                  </strong>

                  <p>{order.customer_name}</p>

                  <span>
                    {formatDate(order.created_at)}
                  </span>
                </div>

                {/* LADO DIREITO */}

                <div>
                  <strong>
                    {formatCurrency(order.total)}
                  </strong>

                  <span
                    className={`admin-status-badge admin-status-${order.status}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =========================
          MODAL DO PEDIDO
      ========================= */}

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER DO MODAL */}

            <div className="order-modal-header">
              <div>
                <span>Pedido</span>

                <h2>
                  #{selectedOrder.order_number}
                </h2>
              </div>

              <button
                type="button"
                className="order-modal-close"
                onClick={closeModal}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            {/* STATUS */}

            <div className="order-modal-status">
              <span
                className={`admin-status-badge admin-status-${selectedOrder.status}`}
              >
                {getStatusLabel(selectedOrder.status)}
              </span>

              <span>
                {formatDate(selectedOrder.created_at)}
              </span>
            </div>

            {/* CLIENTE */}

            <section className="order-modal-section">
              <h3>Cliente</h3>

              <div className="order-info-grid">
                <div>
                  <span>Nome</span>

                  <strong>
                    {selectedOrder.customer_name}
                  </strong>
                </div>

                <div>
                  <span>Telefone</span>

                  <strong>
                    {selectedOrder.customer_phone}
                  </strong>
                </div>
              </div>
            </section>

            {/* ITENS */}

            <section className="order-modal-section">
              <h3>Itens do pedido</h3>

              {selectedOrder.items &&
                selectedOrder.items.length > 0 ? (
                <div className="order-items-list">
                  {selectedOrder.items.map(
                    (item, index) => (
                      <div
                        className="order-item"
                        key={`${item.id}-${index}`}
                      >
                        <div className="order-item-main">
                          <div>
                            <strong>
                              {item.quantity}x {item.name}
                            </strong>

                            {/* VARIAÇÃO */}

                            {item.variant && (
                              <span>
                                Tamanho:{" "}
                                {getVariantLabel(
                                  item.variant,
                                )}
                              </span>
                            )}

                            {/* CARNE */}

                            {item.meat && (
                              <span>
                                Carne:{" "}
                                {getMeatLabel(item.meat)}
                              </span>
                            )}

                            {/* PONTO */}

                            {item.meatPoint && (
                              <span>
                                Ponto:{" "}
                                {getMeatPointLabel(
                                  item.meatPoint,
                                )}
                              </span>
                            )}

                            {/* OBSERVAÇÃO */}

                            {item.observation && (
                              <span>
                                Obs.: {item.observation}
                              </span>
                            )}
                          </div>

                          <strong>
                            {formatCurrency(
                              item.unitPrice *
                              item.quantity,
                            )}
                          </strong>
                        </div>

                        {/* EXTRAS */}

                        {item.extras &&
                          item.extras.length > 0 && (
                            <div className="order-item-extras">
                              <span>Extras:</span>

                              <ul>
                                {item.extras.map(
                                  (extra) => (
                                    <li
                                      key={extra.id}
                                    >
                                      {extra.name} —{" "}
                                      {formatCurrency(
                                        extra.price,
                                      )}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="order-empty-info">
                  Os itens deste pedido não estão
                  disponíveis neste registro.
                </p>
              )}
            </section>

            {/* ENTREGA */}

            <section className="order-modal-section">
              <h3>Entrega</h3>

              <div className="order-info-list">
                {selectedOrder.address && (
                  <div>
                    <span>Endereço</span>

                    <strong>
                      {selectedOrder.address}
                    </strong>
                  </div>
                )}

                {selectedOrder.neighborhood && (
                  <div>
                    <span>Bairro</span>

                    <strong>
                      {selectedOrder.neighborhood}
                    </strong>
                  </div>
                )}

                {selectedOrder.complement && (
                  <div>
                    <span>Complemento</span>

                    <strong>
                      {selectedOrder.complement}
                    </strong>
                  </div>
                )}

                {selectedOrder.delivery_fee !==
                  undefined && (
                    <div>
                      <span>Taxa de entrega</span>

                      <strong>
                        {formatCurrency(
                          selectedOrder.delivery_fee,
                        )}
                      </strong>
                    </div>
                  )}
              </div>
            </section>

            {/* PAGAMENTO */}

            <section className="order-modal-section">
              <h3>Pagamento</h3>

              <div className="order-info-list">
                <div>
                  <span>Forma de pagamento</span>

                  <strong>
                    {getPaymentLabel(
                      selectedOrder.payment_method,
                    )}
                  </strong>
                </div>

                {selectedOrder.change_for !==
                  undefined &&
                  selectedOrder.change_for > 0 && (
                    <div>
                      <span>Troco para</span>

                      <strong>
                        {formatCurrency(
                          selectedOrder.change_for,
                        )}
                      </strong>
                    </div>
                  )}
              </div>
            </section>

            {/* OBSERVAÇÃO DO PEDIDO */}

            {selectedOrder.observation && (
              <section className="order-modal-section">
                <h3>Observação</h3>

                <p className="order-observation">
                  {selectedOrder.observation}
                </p>
              </section>
            )}

            {/* RESUMO */}

            <section className="order-modal-total">
              {selectedOrder.subtotal !==
                undefined && (
                  <div>
                    <span>Subtotal</span>

                    <strong>
                      {formatCurrency(
                        selectedOrder.subtotal,
                      )}
                    </strong>
                  </div>
                )}

              {selectedOrder.delivery_fee !==
                undefined && (
                  <div>
                    <span>Entrega</span>

                    <strong>
                      {formatCurrency(
                        selectedOrder.delivery_fee,
                      )}
                    </strong>
                  </div>
                )}

              <div className="order-total-final">
                <span>Total</span>

                <strong>
                  {formatCurrency(
                    selectedOrder.total,
                  )}
                </strong>
              </div>
            </section>

            {/* FECHAR */}

            <button
              type="button"
              className="order-modal-footer-button"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Orders;