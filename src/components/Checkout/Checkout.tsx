import "./Checkout.css";
import { supabase } from "../../lib/supabase";
import type { OrderData } from "../../types";
import { useCart } from "../../hooks/useCart";
import { useState } from "react";
import { neighborhoods } from "../../data/neighborhoods";
import { toAnalyticsItems, trackEvent } from "../../lib/analytics";

interface CheckoutProps {
  onClose: () => void;
}

export function Checkout({ onClose }: CheckoutProps) {

  const { items, subtotal, clearCart } = useCart();

  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [changeFor, setChangeFor] = useState("");
  const [needsChange, setNeedsChange] = useState(true);
  const [pixKeyCopied, setPixKeyCopied] = useState(false);


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [observation, setObservation] = useState("");
  const [orderId, setOrderId] = useState("");
  const [confirmedOrder, setConfirmedOrder] =
    useState<OrderData | null>(null);

  const handleWhatsApp = () => {
    const phone = "5532984550411";

    const message = `Olá! Meu nome é ${confirmedOrder?.customer.name} e gostaria de falar sobre o pedido #${orderId}.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    street: "",
    number: "",
    neighborhood: "",
    paymentMethod: "",
    changeFor: "",
  });

  const selectedNeighborhoodData = neighborhoods.find(
    (neighborhood) => neighborhood.name === selectedNeighborhood,
  );

  const deliveryFee =
    selectedNeighborhoodData?.deliveryFee ?? 0;

  const total = subtotal + deliveryFee;

  async function copyPixKey() {
    try {
      await navigator.clipboard.writeText("32984806357");
      setPixKeyCopied(true);
      window.setTimeout(() => setPixKeyCopied(false), 2500);
    } catch (error) {
      console.error("Não foi possível copiar a chave PIX:", error);
    }
  }

  const handleSubmit = async () => {
    const newErrors = {
      name: "",
      phone: "",
      street: "",
      number: "",
      neighborhood: "",
      paymentMethod: "",
      changeFor: "",
    };

    if (!name.trim()) {
      newErrors.name = "Informe seu nome.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Informe seu telefone.";
    }

    if (!street.trim()) {
      newErrors.street = "Informe sua rua.";
    }

    if (!number.trim()) {
      newErrors.number = "Informe o número.";
    }

    if (!selectedNeighborhood) {
      newErrors.neighborhood = "Selecione seu bairro.";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod =
        "Selecione uma forma de pagamento.";
    }

    if (
      paymentMethod === "dinheiro" &&
      needsChange &&
      (!changeFor || Number(changeFor) <= 0)
    ) {
      newErrors.changeFor =
        "Informe para quanto precisa de troco.";
    }

    if (
      paymentMethod === "dinheiro" &&
      needsChange &&
      Number(changeFor) < total
    ) {
      newErrors.changeFor =
        "O valor informado é menor que o total.";
    }

    setErrors(newErrors);

    const firstError = Object.keys(newErrors).find(
      (key) =>
        newErrors[key as keyof typeof newErrors],
    );

    if (firstError) {
      const element = document.getElementById(
        `checkout-${firstError}`,
      );

      element?.focus();

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    const order: OrderData = {
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: `${street.trim()}, ${number.trim()}`,
        neighborhoodId: selectedNeighborhood,
        complement: complement.trim() || undefined,
      },

      items,

      paymentMethod:
        paymentMethod === "dinheiro"
          ? "cash"
          : paymentMethod === "cartao"
            ? "card"
            : "pix",

      changeFor:
        paymentMethod === "dinheiro" && Number(changeFor) > 0
          ? Number(changeFor)
          : undefined,

      observation: observation.trim() || undefined,

      deliveryFee,
      subtotal,
      total,
    };

    try {
      const { data, error } = await supabase.rpc("create_order", {
        p_order: order,
      });
console.log("Resposta RPC:", { data, error });
      if (error) {
        console.error("Erro ao criar pedido no Supabase:", error);
        return;
      }

      // Suporta retorno tanto como Array quanto como Object único
      const createdOrder = Array.isArray(data) ? data[0] : data;

      if (!createdOrder) {
        console.error("O Supabase não retornou os dados do pedido.");
        return;
      }

      // Extrai o order_number ou id gerado
      const generatedId = createdOrder.order_number || createdOrder.id || "N/A";

      setOrderId(String(generatedId));
      setConfirmedOrder(order);
      trackEvent("purchase", {
        transaction_id: String(generatedId),
        currency: "BRL",
        value: total,
        shipping: deliveryFee,
        payment_type: order.paymentMethod,
        items: toAnalyticsItems(items),
      });
    } catch (error) {
      console.error("Erro inesperado ao criar pedido:", error);
    }
  };

  if (confirmedOrder) {

    const handleFinishOrder = () => {
      clearCart();
      setConfirmedOrder(null);
      onClose();
    };

    return (
      <div className="checkout__overlay">
        <section className="checkout checkout--success">
          <header className="checkout__header">
            <div>
              <h2>Pedido confirmado!</h2>
              <span>
                Obrigado, {confirmedOrder.customer.name}.
              </span>
            </div>

            <button
              type="button"
              className="checkout__submit"
              onClick={handleFinishOrder}
            >
              ×
            </button>
          </header>

          <div className="checkout__success">
            <div className="checkout__success-icon">
              ✓
            </div>

            <h3>Seu pedido foi recebido!</h3>
            <span className="checkout__order-id">
              Pedido #{orderId}
            </span>

            <p>
              Confira abaixo o resumo do seu pedido.
            </p>

            <div className="checkout__success-summary">
              <div>
                <span>Subtotal</span>
                <strong>
                  {confirmedOrder.subtotal.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </strong>
              </div>

              <div>
                <span>Taxa de entrega</span>
                <strong>
                  {confirmedOrder.deliveryFee.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </strong>
              </div>

              <div>
                <span>Total</span>
                <strong>
                  {confirmedOrder.total.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </strong>
              </div>
            </div>

            <div className="checkout__success-payment">
              <strong>Pagamento</strong>

              <span>
                {confirmedOrder.paymentMethod === "cash"
                  ? "Dinheiro"
                  : confirmedOrder.paymentMethod === "pix"
                    ? "PIX"
                    : "Cartão"}
              </span>

              {confirmedOrder.changeFor !== undefined && (
                <span>
                  Troco para:{" "}
                  {confirmedOrder.changeFor.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </span>
              )}
            </div>

            <div className="checkout__success-address">
              <strong>Endereço de entrega</strong>

              <span>
                {confirmedOrder.customer.address}
              </span>

              <span>
                {confirmedOrder.customer.neighborhoodId}
              </span>

              {confirmedOrder.customer.complement && (
                <span>
                  {confirmedOrder.customer.complement}
                </span>
              )}
            </div>

            <div className="checkout__success-items">
              <strong>Itens do pedido</strong>

              {confirmedOrder.items.map((item) => (
                <div key={item.id}>
                  <span>
                    {item.quantity}x {item.name}
                  </span>

                  <strong>
                    {(
                      (item.unitPrice +
                        item.extras.reduce(
                          (total, extra) =>
                            total + extra.price,
                          0,
                        )) *
                      item.quantity
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <footer className="checkout__footer">
            <button
              type="button"
              className="checkout__submit"
              onClick={() => {
                clearCart();
                onClose();
              }}
            >
              Fechar
            </button>
            <button
              type="button"
              className="checkout__whatsapp"
              onClick={handleWhatsApp}
            >
              Chama nóis!
            </button>
          </footer>
        </section>
      </div>
    );
  }
  return (
    <div className="checkout__overlay">
      <section className="checkout">
        <header className="checkout__header">
          <div>
            <h2>Finalizar pedido</h2>
            <span>Confira seus dados para continuar</span>
          </div>

          <button
            type="button"
            className="checkout__close"
            onClick={onClose}
            aria-label="Fechar checkout"
          >
            ×
          </button>
        </header>

        <div className="checkout__content">
          <section className="checkout__section">
            <h3>Seu pedido</h3>

            {items.map((item) => {
              const extrasTotal = item.extras.reduce(
                (total, extra) => total + extra.price,
                0,
              );

              const itemTotal =
                (item.unitPrice + extrasTotal) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="checkout__item"
                >
                  <div>
                    <strong>
                      {item.quantity}x {item.name}
                    </strong>

                    {item.variant && (
                      <span>{item.variant}</span>
                    )}

                    {item.extras.length > 0 && (
                      <span>
                        {item.extras
                          .map((extra) => extra.name)
                          .join(", ")}
                      </span>
                    )}
                  </div>

                  <strong>
                    {itemTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
              );
            })}
          </section>

          <section className="checkout__section">
            <h3>Dados do cliente</h3>

            <div className="checkout__fields">
              <label>
                Nome

                <input
                  id="checkout-name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  className={
                    errors.name
                      ? "checkout__input--error"
                      : ""
                  }
                  onChange={(event) => {
                    setName(event.target.value);

                    if (errors.name) {
                      setErrors((current) => ({
                        ...current,
                        name: "",
                      }));
                    }
                  }}
                />

                {errors.name && (
                  <span className="checkout__field-error">
                    {errors.name}
                  </span>
                )}
              </label>

              <label>
                Telefone

                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  className={
                    errors.phone
                      ? "checkout__input--error"
                      : ""
                  }
                  onChange={(event) => {
                    setPhone(event.target.value);

                    if (errors.phone) {
                      setErrors((current) => ({
                        ...current,
                        phone: "",
                      }));
                    }
                  }}
                />

                {errors.phone && (
                  <span className="checkout__field-error">
                    {errors.phone}
                  </span>
                )}
              </label>
            </div>
          </section>

          <section className="checkout__section">
            <h3>Endereço de entrega</h3>

            <div className="checkout__fields">
              <label>
                Rua

                <input
                  id="checkout-street"
                  type="text"
                  placeholder="Nome da rua"
                  value={street}
                  className={
                    errors.street
                      ? "checkout__input--error"
                      : ""
                  }
                  onChange={(event) => {
                    setStreet(event.target.value);

                    if (errors.street) {
                      setErrors((current) => ({
                        ...current,
                        street: "",
                      }));
                    }
                  }}
                />

                {errors.street && (
                  <span className="checkout__field-error">
                    {errors.street}
                  </span>
                )}
              </label>

              <label>
                Número

                <input
                  id="checkout-number"
                  type="text"
                  placeholder="Número"
                  value={number}
                  className={
                    errors.number
                      ? "checkout__input--error"
                      : ""
                  }
                  onChange={(event) => {
                    setNumber(event.target.value);

                    if (errors.number) {
                      setErrors((current) => ({
                        ...current,
                        number: "",
                      }));
                    }
                  }}
                />

                {errors.number && (
                  <span className="checkout__field-error">
                    {errors.number}
                  </span>
                )}
              </label>

              <label>
                Complemento

                <input
                  type="text"
                  placeholder="Apartamento, casa, referência..."
                  value={complement}
                  onChange={(event) =>
                    setComplement(event.target.value)
                  }
                />
              </label>

              <label>
                Bairro

                <select
                  id="checkout-neighborhood"
                  value={selectedNeighborhood}
                  className={
                    errors.neighborhood
                      ? "checkout__input--error"
                      : ""
                  }
                  onChange={(event) => {
                    setSelectedNeighborhood(
                      event.target.value,
                    );

                    if (errors.neighborhood) {
                      setErrors((current) => ({
                        ...current,
                        neighborhood: "",
                      }));
                    }
                  }}
                >
                  <option value="" disabled>
                    Selecione seu bairro
                  </option>

                  {neighborhoods.map((neighborhood) => (
                    <option
                      key={neighborhood.name}
                      value={neighborhood.name}
                    >
                      {neighborhood.name}
                    </option>
                  ))}
                </select>

                {errors.neighborhood && (
                  <span className="checkout__field-error">
                    {errors.neighborhood}
                  </span>
                )}
              </label>
            </div>
          </section>

          <section className="checkout__section">
            <h3>Forma de pagamento</h3>

            <div
              id="checkout-paymentMethod"
              className="checkout__payment"
              tabIndex={-1}
            >
              <button
                type="button"
                className={
                  paymentMethod === "pix"
                    ? "checkout__payment--selected"
                    : ""
                }
                onClick={() => {
                  setPaymentMethod("pix");
                  setNeedsChange(true);
                  setChangeFor("");

                  setErrors((current) => ({
                    ...current,
                    paymentMethod: "",
                    changeFor: "",
                  }));
                  trackEvent("add_payment_info", {
                    currency: "BRL",
                    value: total,
                    payment_type: "pix",
                    items: toAnalyticsItems(items),
                  });
                }}
              >
                PIX
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "dinheiro"
                    ? "checkout__payment--selected"
                    : ""
                }
                onClick={() => {
                  setPaymentMethod("dinheiro");
                  setNeedsChange(true);
                  setChangeFor("");

                  setErrors((current) => ({
                    ...current,
                    paymentMethod: "",
                    changeFor: "",
                  }));
                  trackEvent("add_payment_info", {
                    currency: "BRL",
                    value: total,
                    payment_type: "cash",
                    items: toAnalyticsItems(items),
                  });
                }}
              >
                Dinheiro
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "cartao"
                    ? "checkout__payment--selected"
                    : ""
                }
                onClick={() => {
                  setPaymentMethod("cartao");
                  setNeedsChange(true);
                  setChangeFor("");

                  setErrors((current) => ({
                    ...current,
                    paymentMethod: "",
                    changeFor: "",
                  }));
                  trackEvent("add_payment_info", {
                    currency: "BRL",
                    value: total,
                    payment_type: "card",
                    items: toAnalyticsItems(items),
                  });
                }}
              >
                Cartão
              </button>
            </div>

            {errors.paymentMethod && (
              <span className="checkout__field-error">
                {errors.paymentMethod}
              </span>
            )}

            {paymentMethod === "pix" && (
              <div className="checkout__pix-info" aria-live="polite">
                <strong>Dados para pagamento PIX</strong>
                <span>
                  <strong>Chave PIX:</strong> 32984806357
                </span>
                <span>
                  <strong>Recebedora:</strong> Talita Cristina Lopes Souza
                </span>
                <button type="button" onClick={copyPixKey}>
                  {pixKeyCopied ? "Chave copiada!" : "Copiar chave PIX"}
                </button>
                <p>
                  Após o pagamento, envie o comprovante pelo WhatsApp para
                  confirmar seu pedido.
                </p>
              </div>
            )}

            {paymentMethod === "dinheiro" && (
              <div className="checkout__change">
                <label>
                  Troco para quanto?

                  <input
                    id="checkout-changeFor"
                    type="number"
                    min="0"
                    step="0.01"
                    value={changeFor}
                    className={
                      errors.changeFor
                        ? "checkout__input--error"
                        : ""
                    }
                    onChange={(event) => {
                      setChangeFor(event.target.value);

                      if (errors.changeFor) {
                        setErrors((current) => ({
                          ...current,
                          changeFor: "",
                        }));
                      }
                    }}
                    placeholder="Ex.: 50,00"
                    disabled={!needsChange}
                  />

                  {errors.changeFor && (
                    <span className="checkout__field-error">
                      {errors.changeFor}
                    </span>
                  )}
                </label>

                <button
                  type="button"
                  className="checkout__no-change"
                  onClick={() => {
                    setNeedsChange((current) => !current);
                    setChangeFor("");

                    setErrors((current) => ({
                      ...current,
                      changeFor: "",
                    }));
                  }}
                >
                  {needsChange
                    ? "Não preciso de troco"
                    : "Preciso de troco"}
                </button>

                {needsChange &&
                  Number(changeFor) > 0 &&
                  Number(changeFor) >= total && (
                    <p>
                      Troco:{" "}
                      {(
                        Number(changeFor) - total
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}

                {needsChange &&
                  Number(changeFor) > 0 &&
                  Number(changeFor) < total && (
                    <p className="checkout__change-error">
                      O valor informado é menor que o total.
                    </p>
                  )}

                {!needsChange && (
                  <p className="checkout__change-exact">
                    Pagamento em dinheiro no valor exato
                    do pedido.
                  </p>
                )}
              </div>
            )}
          </section>

          <section className="checkout__section">
            <h3>Observação</h3>

            <textarea
              placeholder="Alguma observação para o pedido?"
              rows={4}
              value={observation}
              onChange={(event) =>
                setObservation(event.target.value)
              }
            />
          </section>
        </div>

        <footer className="checkout__footer">
          <div className="checkout__totals">
            <div>
              <span>Subtotal</span>

              <strong>
                {subtotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <div>
              <span>Taxa de entrega</span>

              <strong>
                {deliveryFee.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <div>
              <span>Total</span>

              <strong>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="checkout__submit"
            onClick={handleSubmit}
          >
            Confirmar pedido
          </button>
        </footer>
      </section>
    </div>
  );
}

export default Checkout;
