import { Link, Outlet } from 'react-router';

function FrontendLayout() {
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              首頁
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/product">
              產品列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              購物車
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              結帳
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              後台登入
            </Link>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>© 2025 我的網站</p>
      </footer>
    </>
  );
}

export default FrontendLayout;
