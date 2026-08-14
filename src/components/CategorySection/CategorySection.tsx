import type { Category, Product } from "../../types";
import ProductCard from "../ProductCard/ProductCard";
import "./CategorySection.css";

interface CategorySectionProps {
  category: Category;
  products: Product[];
}

function CategorySection({
  category,
  products,
}: CategorySectionProps) {
  return (
    <section
      id={category.slug}
      className="category-section"
      aria-labelledby={`${category.id}-title`}
    >
      <div className="category-section__header">
        <h2 id={`${category.id}-title`}>{category.name}</h2>
      </div>

      <div className="category-section__products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;