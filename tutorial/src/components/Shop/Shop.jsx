import { products } from '../../store/data'
import { useAddItem } from '../../store/hooks'

const Shop  = () => {
  const addItem = useAddItem()

  return (
    <div>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h4>
              {product.name} / {product.price}
            </h4>
            <button onClick={() => addItem(product)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Shop