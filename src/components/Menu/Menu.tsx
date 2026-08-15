import { categories } from "../../data/categories";
import { products } from "../../data/product";
import { useEffect, useState, type MouseEvent } from "react";
import CategorySection from "../CategorySection/CategorySection";
import logo from "../../assets/images/logomarca.png";
import darkLogo from "../../assets/images/logoescura.png";
import { supabase } from "../../lib/supabase";
import "./Menu.css";

const orderedCategories = categories.slice().sort((a, b) => a.order - b.order);

function getStoreOpenStatus() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const minutes = value("hour") * 60 + value("minute");
  const opensAt = weekday === "Sat" || weekday === "Sun" ? 17 * 60 : 18 * 60 + 30;
  const closesAt = 22 * 60 + 30;
  const isServiceDay = ["Wed", "Thu", "Fri", "Sat", "Sun"].includes(
    weekday ?? "",
  );

  return isServiceDay && minutes >= opensAt && minutes <= closesAt;
}

function Menu() {
  const [isLightTheme, setIsLightTheme] = useState(
    () => localStorage.getItem("mineiro-theme") === "light",
  );
  const [isStoreOpen, setIsStoreOpen] = useState(getStoreOpenStatus);
  const [manualStoreStatus, setManualStoreStatus] = useState<boolean | null>(null);
  const [unavailableProductIds, setUnavailableProductIds] = useState<string[]>([]);
  const [deliveryTimeMinutes, setDeliveryTimeMinutes] = useState(45);

  function scrollToCategory(
    event: MouseEvent<HTMLAnchorElement>,
    categorySlug: string,
  ) {
    event.preventDefault();
    document.getElementById(categorySlug)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    document.body.classList.toggle("theme-light", isLightTheme);
    localStorage.setItem("mineiro-theme", isLightTheme ? "light" : "dark");
  }, [isLightTheme]);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setIsStoreOpen(getStoreOpenStatus()),
      60_000,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function loadStoreControls() {
      const [{ data: settings }, { data: availability }] = await Promise.all([
        supabase.from("store_settings").select("manual_is_open, delivery_time_minutes").eq("id", 1).maybeSingle(),
        supabase.from("menu_item_availability").select("product_id, is_available"),
      ]);

      setManualStoreStatus(settings?.manual_is_open ?? null);
      setDeliveryTimeMinutes(settings?.delivery_time_minutes ?? 45);
      setUnavailableProductIds(
        (availability ?? [])
          .filter((item) => !item.is_available)
          .map((item) => item.product_id),
      );
    }

    loadStoreControls();
  }, []);

  const storeIsOpen = manualStoreStatus ?? isStoreOpen;
  return (
    <div className="store-menu">
      <header className="store-menu__header">
        <a
          className="store-menu__brand"
          href="#combos"
          aria-label="Mineiro Hamburgueria - início"
          onClick={(event) => scrollToCategory(event, "combos")}
        >
          <img src={isLightTheme ? darkLogo : logo} alt="Mineiro Hamburgueria" />
        </a>
        <nav className="store-menu__navigation" aria-label="Categorias">
          {orderedCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.slug}`}
              onClick={(event) => scrollToCategory(event, category.slug)}
            >
              {category.name}
            </a>
          ))}
        </nav>
        <div className="store-menu__store-info">
          <span
            className={`store-menu__status ${
              storeIsOpen
                ? "store-menu__status--open"
                : "store-menu__status--closed"
            }`}
            role="status"
          >
            {storeIsOpen ? "Loja aberta" : "Loja fechada"}
          </span>
          <span className="store-menu__delivery-time">
            Entrega em cerca de {deliveryTimeMinutes} min
          </span>
        </div>
        <button
          type="button"
          className="store-menu__theme-toggle"
          onClick={() => setIsLightTheme((current) => !current)}
          aria-label={isLightTheme ? "Ativar tema escuro" : "Ativar tema claro"}
        >
          {isLightTheme ? "Tema escuro" : "Tema claro"}
        </button>
      </header>

      <section className="store-menu__hero" aria-label="Apresentação">

        <h1>Feito com<br />jeitinho mineiro.</h1>
        <p>Escolha seus favoritos e monte seu pedido.</p>
      </section>

      <div className="store-menu__categories">
      {orderedCategories.map((category) => {
          const categoryProducts = products.filter(
            (product) => product.categoryId === category.id,
          );

          return (
            <CategorySection
              key={category.id}
              category={category}
              products={categoryProducts}
              unavailableProductIds={unavailableProductIds}
            />
          );
      })}
      </div>
    </div>
  );
}

export default Menu;
