import { createHashRouter } from 'react-router';
import FrontendLayout from './layout/FrontendLayout';
import Home from './views/front/Home';
import Products from './views/front/Products';
import SingleProduct from './views/front/SingleProduct';
import Cart from './views/front/Cart';
import NotFound from './views/front/NotFound';
import Checkout from './views/front/Checkout';
import Login from './views/Login';
import AdminLayout from './layout/AdminLayout';
import AdminOrders from './views/admin/AdminOrders';
import AdminProducts from './views/admin/AdminProducts';

export const router = createHashRouter([
  {
    // 前台頁面
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'product/',
        element: <Products />,
      },
      {
        path: 'product/:id',
        element: <SingleProduct />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    // 後台頁面
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'product',
        element: <AdminProducts />,
      },
      {
        path: 'order',
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
