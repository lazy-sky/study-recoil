import { atom } from 'recoil'
import { localStorageEffect } from './hooks'

// TodoList
export const todoListState = atom({
  key: 'todoListState',
  default: [],
  effects: [localStorageEffect('recoilTodos')]
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