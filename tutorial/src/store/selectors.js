/**
 * Selector는 파생된 상태의 일부를 나타낸다. 
 * 파생된 상태는 어떤 방법으로든 주어진 상태를 수정하는 순수 함수에 전달된 상태의 결과물로 생각하면 된다.
 * 파생된 상태는 다른 데이터의 의존하는 동적인 데이터를 만들 수 있기 때문에 강력한 개념이다.
 * e.g.,
    - 필터링된 Todo 리스트
      - 필터링을 구현하려면 atom에 저장될 수 있는 필터 기준을 선택해야 한다. (e.g., "Show All", "Show Completed"...)
    - Todo 리스트 통계
 */

import { selector } from 'recoil'
import { todoListFilterState, todoListState } from './atoms'

// todoListFilterState와 todoListState를 사용해서 필터링된 리스트를 파생하는 
// filteredTodoListState를 구성할 수 있다.
export const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    // 2개의 의존성 todoListFilterState와 todoListState을 추적한다. 
    // 둘 중 하나라도 변하면 filteredTodoListState는 재실행된다.
    const filter = get(todoListFilterState)
    const list = get(todoListState)

    switch (filter) {
      case 'Show Completed':
        return list.filter(item => item.isComplete)
      case 'Show Uncompleted':
        return list.filter(item => !item.isComplete)
      default:
        return list
    }
  }
})

export const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState)
    const totalCount = todoList.length
    const totalCompletedCount = todoList.filter(item => item.isComplete).length
    const totalUncompletedCount = totalCount - totalCompletedCount
    const percentCompleted = totalCount === 0 ? 0 : totalCompletedCount / totalCount

    return {
      totalCount,
      totalCompletedCount,
      totalUncompletedCount,
      percentCompleted,
    }
  }
})