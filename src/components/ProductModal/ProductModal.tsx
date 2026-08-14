import { useMemo, useState } from "react";
import "./ProductModal.css";
import type { CartItem, CartItemExtra, Product } from "../../types";
import { useCart } from "../../hooks/useCart";
import { extras } from "../../data/extras";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  initialItem?: CartItem;
}

function ProductModal({
  product,
  onClose,
  initialItem,
}: ProductModalProps) {
  const { addToCart, updateCartItem } = useCart();

  const hasVariants = Boolean(product.prices);

  const [variant, setVariant] = useState<
    CartItem["variant"]
  >(
    initialItem?.variant ??
    (hasVariants ? "simples" : undefined),
  );

  const [meat, setMeat] = useState<
    CartItem["meat"]
  >(
    initialItem?.meat ??
    (product.hasMeatChoice ? "boi" : undefined),
  );

  const [meatPoint, setMeatPoint] = useState<
    CartItem["meatPoint"]
  >(
    initialItem?.meatPoint ??
    (product.hasMeatPoint
      ? "ao-ponto"
      : undefined),
  );

  const [selectedExtras, setSelectedExtras] =
    useState<CartItemExtra[]>(
      initialItem?.extras ?? [],
    );

  const [observation, setObservation] =
    useState(
      initialItem?.observation ?? "",
    );

  const unitPrice = useMemo(() => {
    if (product.prices && variant) {
      return product.prices[variant];
    }

    return product.price ?? 0;
  }, [product, variant]);


  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce(
      (total, extra) => total + extra.price,
      0,
    );
  }, [selectedExtras]);

  const total = unitPrice + extrasTotal;


  function toggleExtra(extra: CartItemExtra) {
    setSelectedExtras((currentExtras) => {
      const alreadySelected =
        currentExtras.some(
          (item) => item.id === extra.id,
        );

      if (alreadySelected) {
        return currentExtras.filter(
          (item) => item.id !== extra.id,
        );
      }

      return [...currentExtras, extra];
    });
  }


  function handleAddToCart() {
    const cleanObservation =
      observation.trim() || undefined;

    if (initialItem) {
      updateCartItem(
        initialItem.id,
        unitPrice,
        selectedExtras,
        variant,
        cleanObservation,
        meat,
        meatPoint,
      );
    } else {
      addToCart(
        product,
        unitPrice,
        selectedExtras,
        variant,
        cleanObservation,
        meat,
        meatPoint,
      );
    }

    onClose();
  }


  function handleOverlayClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="product-modal__overlay"
      onClick={handleOverlayClick}
    >
      <div className="product-modal">
        <button
          type="button"
          className="product-modal__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <img
          className="product-modal__image"
          src={product.image}
          alt={product.alt || product.name}
        />

        <div className="product-modal__content">
          <h2>{product.name}</h2>

          {product.description && (
            <p className="product-modal__description">
              {product.description}
            </p>
          )}


          {product.prices && (
            <section className="product-modal__section">
              <h3>Escolha o tamanho</h3>

              <div className="product-modal__options">
                {(
                  [
                    "simples",
                    "duplo",
                    "triplo",
                  ] as const
                ).map((option) => (
                  <label
                    key={option}
                    className={
                      variant === option
                        ? "selected"
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      name={`variant-${product.id}`}
                      value={option}
                      checked={
                        variant === option
                      }
                      onChange={() =>
                        setVariant(option)
                      }
                    />

                    <span>
                      {option
                        .charAt(0)
                        .toUpperCase() +
                        option.slice(1)}
                    </span>

                    <strong>
                      {product.prices![
                        option
                      ].toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        },
                      )}
                    </strong>
                  </label>
                ))}
              </div>
            </section>
          )}



          {product.hasMeatChoice && (
            <section className="product-modal__section">
              <h3>Escolha a carne</h3>

              <div className="product-modal__options">
                <label
                  className={
                    meat === "boi"
                      ? "selected"
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name={`meat-${product.id}`}
                    value="boi"
                    checked={meat === "boi"}
                    onChange={() =>
                      setMeat("boi")
                    }
                  />

                  <span>Carne bovina</span>
                </label>

                <label
                  className={
                    meat === "frango"
                      ? "selected"
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name={`meat-${product.id}`}
                    value="frango"
                    checked={
                      meat === "frango"
                    }
                    onChange={() =>
                      setMeat("frango")
                    }
                  />

                  <span>Carne de frango</span>
                </label>
              </div>
            </section>
          )}



          {product.hasMeatPoint && (
            <section className="product-modal__section">
              <h3>Ponto da carne</h3>

              <div className="product-modal__options">
                <label
                  className={
                    meatPoint ===
                      "malpassado"
                      ? "selected"
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name={`meat-point-${product.id}`}
                    value="malpassado"
                    checked={
                      meatPoint ===
                      "malpassado"
                    }
                    onChange={() =>
                      setMeatPoint(
                        "malpassado",
                      )
                    }
                  />

                  <span>Malpassado</span>
                </label>

                <label
                  className={
                    meatPoint ===
                      "ao-ponto"
                      ? "selected"
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name={`meat-point-${product.id}`}
                    value="ao-ponto"
                    checked={
                      meatPoint ===
                      "ao-ponto"
                    }
                    onChange={() =>
                      setMeatPoint(
                        "ao-ponto",
                      )
                    }
                  />

                  <span>Ao ponto</span>
                </label>

                <label
                  className={
                    meatPoint ===
                      "bem-passado"
                      ? "selected"
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name={`meat-point-${product.id}`}
                    value="bem-passado"
                    checked={
                      meatPoint ===
                      "bem-passado"
                    }
                    onChange={() =>
                      setMeatPoint(
                        "bem-passado",
                      )
                    }
                  />

                  <span>Bem passado</span>
                </label>
              </div>
            </section>
          )}



          {product.extraIds &&
            product.extraIds.length > 0 && (
              <section className="product-modal__section">
                <h3>Adicionais</h3>

                <div className="product-modal__extras">
                  {product.extraIds.map(
                    (extraId) => {
                      const extra =
                        extras.find(
                          (item) =>
                            item.id ===
                            extraId,
                        );

                      if (!extra) {
                        return null;
                      }

                      const selected =
                        selectedExtras.some(
                          (item) =>
                            item.id ===
                            extra.id,
                        );

                      return (
                        <label
                          key={extra.id}
                          className={
                            selected
                              ? "selected"
                              : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={
                              selected
                            }
                            onChange={() =>
                              toggleExtra(
                                extra,
                              )
                            }
                          />

                          <span>
                            {extra.name}
                          </span>

                          <strong>
                            +{" "}
                            {extra.price.toLocaleString(
                              "pt-BR",
                              {
                                style:
                                  "currency",
                                currency:
                                  "BRL",
                              },
                            )}
                          </strong>
                        </label>
                      );
                    },
                  )}
                </div>
              </section>
            )}



          <section className="product-modal__section">
            <h3>Observação</h3>

            <textarea
              value={observation}
              onChange={(event) =>
                setObservation(
                  event.target.value,
                )
              }
              placeholder="Alguma observação para o preparo?"
              rows={3}
            />
          </section>



          <button
            type="button"
            className="product-modal__add"
            onClick={handleAddToCart}
          >
            {initialItem
              ? "Salvar alterações"
              : "Adicionar ao carrinho"}{" "}
            —{" "}
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;