import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { currency } from '../../utils/filter';
import { useForm } from 'react-hook-form';
import { RotatingLines } from 'react-loader-spinner';
import * as bootstrap from 'bootstrap';
import SingleProduct from './SingleProduct';
import SingleProductModal from '../../components/SingleProductModal';
import { emailValidation } from '../../utils/validation';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  // useRef 建立對 DOM 元素的參照取得
  const productModalRef = useRef(null);

  //製作結帳表單react-form
  const {
    register,
    handleSubmit, //送出
    formState: { errors }, //顯示錯誤訊息
  } = useForm({
    mode: 'onChange',
  });

  // 取得購物車資料列表
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
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        console.log(response.data.data);
        setCart(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getCart();

    //初始化
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    document
      .querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  // 加入購物車按鈕的API
  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      console.log(response.data);
      // 送出購物車資料之後，重新更新購物車
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      // 最後，清空購物車
      setLoadingCartId(null);
    }
  };

  // 更新商品數量API
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      console.log(response.data);

      // 更新小計
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // 刪除單一商品API
  const delCart = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${id}`,
      );
      console.log(response.data);

      // 送出購物車資料之後，重新更新購物車
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // 送出訂單API
  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      console.log(response.data);

      // 送出購物車資料之後，重新更新購物車
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // "查看更多"的按鈕功能API
  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`,
      );
      console.log(response.data.product);
      setProduct(response.data.product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }

    productModalRef.current.show(); //show=顯示
  };

  const closeModal = () => {
    productModalRef.current.hide(); // hide=關閉
  };

  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <div
                  style={{
                    height: '100px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      '查看更多'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      '加到購物車'
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button type="button" className="btn btn-outline-danger">
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCart(cartItem.id)}
                >
                  刪除
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    value={cartItem.qty || 1}
                    min="1"
                    disabled={loadingProductId === cartItem.id}
                    onChange={(e) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value) || 1,
                      )
                    }
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test@gamil.com"
              {...register('email', emailValidation)}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="小明"
              {...register('name', {
                required: '請輸入姓名',
                minLength: {
                  value: 2,
                  message: '姓名最少兩個字',
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register('tel', {
                required: '請輸入電話',
                pattern: {
                  value: /^\d+$/,
                  message: '電話僅能輸入數字',
                },
                minLength: {
                  value: 8,
                  message: '電話最少8碼',
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺北市信義區信義路5段7號"
              {...register('address', {
                required: '請輸入地址',
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register('message')}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      {/*引入單筆商品模組*/}
      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}

export default Checkout;
