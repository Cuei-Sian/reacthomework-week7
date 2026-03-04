import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 產品列表頁
function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // 製作切換頁面

  //取得產品資料
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  // 方法一使用state方式："查看更多"的按鈕功能API
  // const handleView = async (id) => {
  //   try {
  //     const response = await axios.get(
  //       `${API_BASE}/api/${API_PATH}/product/${id}`,
  //     );
  //     console.log(response.data.product);
  //     navigate(`/product/${id}`, {
  //       state: {
  //         productData: response.data.product, //將取得的資料傳入下一頁
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // };

  // 方法二：使用useParams
  const handleView = async (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card ">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.title}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">價格：{product.price}</p>
                <p className="card-text">
                  <small className="text-body-secondary">{product.unit}</small>
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleView(product.id)}
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
