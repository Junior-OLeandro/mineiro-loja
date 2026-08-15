import { useState } from "react";

import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types";

import ProductModal from "../ProductModal/ProductModal";

import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  isAvailable: boolean;
}

function ProductCard({ product, isAvailable }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart();

  const hasVariants = Boolean(product.prices);

  function handleAddClick() {
    if (!isAvailable) return;
    const needsModal =
      hasVariants ||
      product.hasMeatChoice ||
      product.hasMeatPoint ||
      Boolean(
        product.extraIds &&
          product.extraIds.length > 0,
      );

    if (needsModal) {
      setIsModalOpen(true);
      return;
    }

    addToCart(product);
  }

  return (
    <>
      <article className="product-card">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.alt || product.name}
          loading="lazy"
        />

        <div className="product-card__content">
          <h3 className="product-card__name">
            {product.name}
          </h3>

          {product.description && (
            <p className="product-card__description">
              {product.description}
            </p>
          )}

          <div className="product-card__footer">
            {hasVariants && product.prices ? (
              <div className="product-card__prices">
                <span>
                  Simples{" "}
                  <strong>
                    {product.prices.simples.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </strong>
                </span>

                <span>
                  Duplo{" "}
                  <strong>
                    {product.prices.duplo.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </strong>
                </span>

                <span>
                  Triplo{" "}
                  <strong>
                    {product.prices.triplo.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </strong>
                </span>
              </div>
            ) : (
              <strong className="product-card__price">
                {product.price?.toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  },
                )}
              </strong>
            )}

            <button
              type="button"
              onClick={handleAddClick}
              disabled={!isAvailable}
            >
              {isAvailable ? "Adicionar" : "Indisponível"}
            </button>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
