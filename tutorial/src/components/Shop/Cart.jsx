import { useRecoilValue } from 'recoil'
import { cartItems } from '../../store/atoms'
import { cartItemsState } from '../../store/selectors'
import { useAddItem, useDecreaseItem, useRemoveItem } from '../../store/hooks'
import styles from './Cart.module.css'

const Cart  = () => {
  const items = useRecoilValue(cartItems)
  const { totalCost } = useRecoilValue(cartItemsState)

  const handleIncreaseClick = useAddItem()
  const handleDecreaseClick = useDecreaseItem()
  const handleRemoveClick = useRemoveItem()

  return (
    <div className={styles.cartList}>
      <div className={styles.cartItem}>
        <div>Product</div>
        <div>Price</div>
        <div>Count</div>
        <div>Total Price</div>
        <div>Delete</div>
      </div>
      
      {items.map(item => (
        <div key={item.id} className={styles.cartItem}>
          <div>{item.name}</div>
          <div>${item.price}</div>
          <div>
            <button onClick={() => handleDecreaseClick(item)}>
              -
            </button>
            {item.count}
            <button onClick={() => handleIncreaseClick(item)}>
              +
            </button>
          </div>
          <div>${item.count * item.price}</div>
          <div>
            <button onClick={() => handleRemoveClick(item)}>
              제거
            </button>
          </div>
        </div>
      ))}

      <div>
        <div>Total price: ${totalCost}</div>
      </div>
    </div>
  )
}

export default Cart
