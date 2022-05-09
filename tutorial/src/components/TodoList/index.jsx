import { useRecoilValue } from 'recoil'
import { todoListState } from '../../store/atoms'
import { filteredTodoListState } from '../../store/selectors'
import TodoItem from './TodoItem'
import TodoItemCreator from './TodoItemCreator'
import TodoListFilters from './TodoListFilters'

const TodoList = () => {
  const todoList = useRecoilValue(filteredTodoListState)

  return (
    <>
      <TodoItemCreator />
      <TodoListFilters />
      {todoList.map(todoItem => 
        <TodoItem key={todoItem.id} item={todoItem} />  
      )}
    </>
  )
}

export default TodoList