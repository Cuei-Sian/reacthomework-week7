import axios from 'axios';
import { useEffect, useState } from 'react';
import { RotatingTriangles } from 'react-loader-spinner';
import { Navigate } from 'react-router';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 路由守衛
function ProtectedRoute({ children }) {
  //登入狀態管理(控制顯示登入或產品頁)
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];
    // 登入成功後，將Token設定到axios的預設Header，之後所有API請求都會自動帶上Token
    // 修改實體建立時所指派的預設配置
    if (token) {
      // 如果真的有取到token才會放入Header上面
      axios.defaults.headers.common['Authorization'] = token;
    }
    // 登入驗證
    const checkLogin = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true);
      } catch (error) {
        console.log(error.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    //呼叫checkLogin
    checkLogin();
  }, []);

  if (loading) return <RotatingTriangles />;
  if (!isAuth) return <Navigate to="/login" />;

  //children指的就是<AdminLayout />頁面
  return children;
}
export default ProtectedRoute;
