import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { cartItemsState } from '../../store/selectors'

const Header = () => {
  const { totalCount } = useRecoilValue(cartItemsState)

  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>
            <h1>Todo</h1>
          </Link>
        </li>
        <li>
          <Link to='/shop'>
            <h1>My Shop</h1>
          </Link>
        </li>
        <li>
          <Link to='/cart'>
            Cart: {totalCount}
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header
