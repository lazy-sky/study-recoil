import { atom } from 'recoil'

// TodoList
export const todoListState = atom({
  key: 'todoListState',
  // TODO: storejs 써보기
  default: JSON.parse(localStorage.getItem('recoilTodos')) || [],
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