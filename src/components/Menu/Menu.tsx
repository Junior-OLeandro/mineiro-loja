import { categories } from "../../data/categories";
import { products } from "../../data/product";
import CategorySection from "../CategorySection/CategorySection";

function Menu() {
  return (
    <div>
      {categories
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((category) => {
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
  );
}

export default Menu;