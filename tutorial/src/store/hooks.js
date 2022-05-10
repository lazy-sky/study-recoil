import { useRecoilState } from 'recoil'
import store from 'storejs'
import { cartItems } from './atoms'

const cloneIndex = (items, id) => ({
  clone: items.map(item => ({ ...item })),
  index: items.findIndex(item => item.id === id),
})

export const useAddItem = () => {
  const [items, setItems] = useRecoilState(cartItems)

  return (product) => {
    const { clone, index } = cloneIndex(items, product.id)

    if (index !== -1) {
      clone[index].count += 1
      setItems(clone)
    } else {
      setItems([
        ...clone, 
        { ...product, count: 1 }
      ])
    }
  }
}

export const useDecreaseItem = () => {
	const [items, setItems] = useRecoilState(cartItems)
	const removeItem = useRemoveItem()

	return product => {
    const { clone, index } = cloneIndex(items, product.id)
    
    if (clone[index].count === 1) {
      removeItem(product)
    } else {
      clone[index].count -= 1
      setItems(clone)
    }
  }
}

export const useRemoveItem = () => {
	const [items, setItems] = useRecoilState(cartItems)

	return product => {
    setItems(items.filter((item) => item.id !== product.id))
	}
}

export const localStorageEffect = key => ({ setSelf, onSet }) => {
  const savedValue = store.get(key)
  if (!!savedValue) {
    setSelf(savedValue)
  }

  onSet((newValue, _, isReset) => {
    isReset
      ? store.remove(key)
      : store.set(key, newValue)
  })
}