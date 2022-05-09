import { RecoilRoot } from 'recoil';
import { Route, Routes } from 'react-router-dom';
import TodoList from './components/TodoList';
import Shop from './components/Shop/Shop';
import Cart from './components/Shop/Cart';
import Header from './components/Header';

function App() {
  return (
    <RecoilRoot>
      <Header />
      <Routes>
        <Route path='/' element={<TodoList />}/>
        <Route path='/shop' element={<Shop />}/>
        <Route path='/cart' element={<Cart />}/>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
