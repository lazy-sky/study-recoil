import { useRecoilValue } from 'recoil'

import { filteredTodoListState } from '../../store/selectors'
import TodoItem from './TodoItem'
import TodoItemCreator from './TodoItemCreator'
import TodoListFilters from './TodoListFilters'
import TodoListStats from './TodoListStats'

const TodoList = () => {
  const todoList = useRecoilValue(filteredTodoListState)

  return (
    <>
      <TodoListStats />
      <TodoItemCreator />
      <TodoListFilters />
      {todoList.map(todoItem => 
        <TodoItem key={todoItem.id} item={todoItem} />  
      )}
    </>
  )
}

export default TodoList