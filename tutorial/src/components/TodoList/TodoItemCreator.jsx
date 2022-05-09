import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { todoListState } from '../../store/atoms'

const TodoItemCreator = () => {
  const [inputValue, setInputValue] = useState('')
  const setTodoList = useSetRecoilState(todoListState)
  /**
   * 새로운 todo 아이템을 생성하기 위해선 todoListState 내용을 업데이트하는 setter 함수에 접근해야 한다.
   * TodoItemCreator의 setter 함수를 얻기 위해 useSetRecoilState를 사용할 수 있다.
   * 기존 todo 리스트를 기반으로 새 todo 리스트를 만들 수 있도록 setter 함수의 updater 형식을 사용한다.
   */

  const addItem = (event) => {
    event.preventDefault();
    
    setTodoList(prevList => [
      ...prevList,
      {
        id: Math.random(), // 임시 uid
        content: inputValue,
        isComplete: false,
      },
    ])
    setInputValue('')
  }

  const handleInputValueChange = (event) => {
    const { target: { value } } = event;
    
    setInputValue(value);
  };

  return (
    <div>
      <form onSubmit={addItem}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputValueChange} 
        />
        <button onClick={addItem}>Add</button>
      </form>
    </div>
  );
}

export default TodoItemCreator