import { categories } from "../../data/categories";
import { products } from "../../data/product";
import CategorySection from "../CategorySection/CategorySection";
import logo from "../../assets/images/logomarca.png";
import "./Menu.css";

const orderedCategories = categories.slice().sort((a, b) => a.order - b.order);

function Menu() {
  return (
    <div className="store-menu">
      <header className="store-menu__header">
        <a className="store-menu__brand" href="#combos" aria-label="Mineiro Hamburgueria - início">
          <img src={logo} alt="Mineiro Hamburgueria" />
        </a>
        <nav className="store-menu__navigation" aria-label="Categorias">
          {orderedCategories.map((category) => (
            <a key={category.id} href={`#${category.slug}`}>{category.name}</a>
          ))}
        </nav>
      </header>

      <section className="store-menu__hero" aria-label="Apresentação">
        <p>Hambúrguer artesanal em Barbacena</p>
        <h1>Feito no capricho,<br />do jeito mineiro.</h1>
        <span>Escolha seus favoritos e monte seu pedido.</span>
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
