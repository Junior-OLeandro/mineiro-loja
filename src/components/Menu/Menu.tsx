import { categories } from "../../data/categories";
import { products } from "../../data/product";
import { useEffect, useState, type MouseEvent } from "react";
import CategorySection from "../CategorySection/CategorySection";
import logo from "../../assets/images/logomarca.png";
import darkLogo from "../../assets/images/logoescura.png";
import "./Menu.css";

const orderedCategories = categories.slice().sort((a, b) => a.order - b.order);

function Menu() {
  const [isLightTheme, setIsLightTheme] = useState(
    () => localStorage.getItem("mineiro-theme") === "light",
  );

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
            />
          );
      })}
      </div>
    </div>
  );
}

export default Menu;
