import { useRecoilState } from 'recoil'
import { todoListState } from '../../store/atoms'

/**
 * TodoItem은 todo리스트의 값을 표시하는 동시에, 
 * 텍스트를 변경하고 항목을 삭제할 수 있다.
 * todoListState를 읽고 항목 텍스트를 업데이트하고, 완료된 것으로 표시하고, 삭제하는 데 사용하는
 * setter 함수를 얻기 위해 useRecoilState를 사용한다.
 */
const TodoItem = ({ item }) => {
  const [todoList, setTodoList] = useRecoilState(todoListState)
  const index = todoList.findIndex(listItem => listItem === item)

  const editTodo = (e) => {
    const { target: { value } } = e
    const newList = [
      ...todoList.slice(0, index), 
      {
        ...item,
        content: value,
      },
      ...todoList.slice(index + 1)
    ]

    setTodoList(newList)
  }

  const toggleTodoComplete = () => {
    const newList = [
      ...todoList.slice(0, index),
      {
        ...item,
        isComplete: !item.isComplete,
      },
      ...todoList.slice(index + 1)
    ]

    setTodoList(newList)
  }

  const deleteTodo = () => {
    const newList = [
      ...todoList.slice(0, index),
      ...todoList.slice(index + 1)
    ]

    setTodoList(newList)
  }

  return (
    <div>
      <input 
        type="text" 
        value={item.content}
        onChange={editTodo}
      />
      <input 
        type="checkbox" 
        checked={item.isCompleted}
        onChange={toggleTodoComplete}
      />
      <button type='button' onClick={deleteTodo}>X</button>
    </div>
  )
}

export default TodoItem