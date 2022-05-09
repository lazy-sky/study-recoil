import store from 'storejs'
import { atom } from 'recoil'

// TodoList
export const todoListState = atom({
  key: 'todoListState',
  default: store.get('recoilTodos')  || [],
})

export const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'Show All',
})

// Shop with cart
export const cartItems = atom({
  key: 'cartItems',
  default: [],
})