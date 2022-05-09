import { useRecoilValue } from 'recoil'
import { todoListStatsState } from '../../store/selectors'

const TodoListStats = () => {
  const {
    totalCount,
    totalCompletedCount,
    totalUncompletedCount,
    percentCompleted,
  } = useRecoilValue(todoListStatsState)

  const formattedPercentCompleted = Math.round(percentCompleted * 100)

  return (
    <ul>
      <li>Total items: {totalCount}</li>
      <li>Items completed: {totalCompletedCount}</li>
      <li>Items not completed: {totalUncompletedCount}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  )
}

export default TodoListStats