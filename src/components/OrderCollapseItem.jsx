// components
import Collapse from '@mui/material/Collapse';
import RatingStars from '@ui/RatingStars';
import SubmenuTrigger from '@ui/SubmenuTrigger';
import {NavLink, useNavigate} from 'react-router-dom';


// utils
import PropTypes from 'prop-types';
import {getStatusColor} from '@utils/helpers';
import { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';
import Loader from './Loader';

const OrderCollapseItem = ({order, activeCollapse, handleCollapse, role}) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orderDetail, setOrderDetail] = useState();
    const [changeStatus, setChangeStatus] = useState();

    useEffect(() => {
        fetchData();
    }, [changeStatus]);
    
     const fetchData = async () => {
        try {
            if(role==='user'){
                const productPromises = order.order_products.flatMap(pro =>
                    pro.item_products.map(async productDetail => {
                        const result = await axiosClient.get(`/product/num/${productDetail.productId}`, {
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                                // 'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                // 'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                            },
                        });
                        return result; // Lấy dữ liệu cần thiết từ kết quả
                    })
                );

                // Chờ tất cả các yêu cầu hoàn tất và lấy kết quả
                const productResults = await Promise.all(productPromises);

                // Cập nhật state với tất cả các sản phẩm đã lấy được
                setProducts(productResults);
            }else if(role === 'shop'){
                const result = await axiosClient.get(`/product/num/${order.order_products.item_products[0].productId}`, {
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                                // 'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                // 'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                            },
                        });
                setProducts([result]);
            }
            
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    // const isExtraSmall = useWindowSize().width < 375;

    const status = order.order_payment.amount === order.order_payment.received ?
        'Fully paid'
        :
        (order.order_payment.amount > order.order_payment.received && order.order_payment.received !== 0) ? 'Partially paid' : 'Payment after receipt';

    let numberProduct = 1;
    if(role==='user'){
        numberProduct = order.order_products.reduce(
            (total, product) => {
                return total + product.item_products.length;
            },0
        )
    }

    const handleChangeStatus = async(event) => {
        event.preventDefault();
        const Order = await axiosClient
            .post(`/checkout/order/${order._id}`, {},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

        setOrderDetail(Order); 
        const indexOrder = Order.order_products.map((val, ind) => {
            if(val.item_products[0].productId === order.order_products.item_products[0].productId){
                return ind;
            }else {
                return -1;
            }
        });

        function replaceArrayElements(mainArray, subArray) {
            if (mainArray.length !== subArray.length) {
                throw new Error("Main array and sub array must have the same length.");
            }

            for (let i = 0; i < mainArray.length; i++) {
                if (subArray[i] !== -1) {
                mainArray[i] = subArray[i];
                }
            }

            return mainArray;
        }
        let dataUpdate;
        if(Order.order_status.includes('pending')){
            let statusOrder;
            if (Order.order_status.includes('|')){
                statusOrder = Order.order_status.split('|');
                const array = JSON.parse(statusOrder[2]);
                statusOrder = replaceArrayElements(indexOrder, array);
            }else{
                statusOrder = indexOrder;
            }
            

            const pt = statusOrder.filter(x => x > -1).length/statusOrder.length*100;   
            if(pt < 100){
                dataUpdate = {
                    orderId: order._id, 
                    order_status: `pending|${pt}|[${statusOrder}]`,
                }
            }else{
                dataUpdate = {
                    orderId: order._id, 
                    order_status: `shipping`,
                }
            }
        }else if(Order.order_status.includes('shipping')){
            dataUpdate = {
                    orderId: order._id, 
                    order_status: `shipped`,
            }
        }else if(Order.order_status.includes('shipped')){
            dataUpdate = {
                    orderId: order._id, 
                    order_status: `completed`,
            }
        }
        const OrderUpdate = await axiosClient
            .patch(`/checkout/order/edit`, dataUpdate,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        setChangeStatus(OrderUpdate);
        window.location.reload();
    }

    if(products.length !== numberProduct) return (<Loader />)
    if(role==='user'){
        return (
            <div className="card">
                <div className="flex items-center justify-between">
                    <span className="subheading-2">{order.order_trackingNumber}</span>
                    <div className="flex flex-col mx-5 w-48">
                        <span className="font-heading font-bold text-header">
                            {status !== 'Fully paid' && `$ ${order.order_payment.received} Paid `}
                            $ {order.order_payment.amount}
                        </span>
                        <span>{status}</span>
                    </div>
                    <div className="flex flex-col mx-5 w-32">
                        <span className="font-heading font-bold text-header">
                            ${order.order_checkout.totalPrice}
                        </span>
                        <span>${order.order_checkout.totalCheckout}</span>
                    </div>
                    <div className="flex flex-col mx-5">
                        <span>Total Discount</span>
                        <span className="font-heading font-bold text-header">
                            ${order.order_checkout.totalDiscount}
                        </span>
                    </div>
                    <div className="flex flex-col mx-5">
                        <span>Free Ship</span>
                        <span className="font-heading font-bold text-header">
                            ${order.order_checkout.freeShip}
                        </span>
                    </div>
                  
                    <span className="badge-status badge-status--lg mx-5"
                        style={{
                            backgroundColor: `var(--${getStatusColor(order.order_status)})`,
                            width: '15%'
                        }}>
                        {order.order_status}
                    </span>
                    
                    <div className="flex items-center gap-4">
                        <button className={`collapse-btn ${activeCollapse === order._id ? 'active' : ''}`}
                                aria-label="Toggle view"
                                onClick={() => handleCollapse(order._id)}>
                            <i className="icon icon-caret-down-solid"/>
                        </button>
                        <NavLink to="/product-editor" aria-label="Edit">
                            <i className="icon icon-pen-to-square-regular"/>
                        </NavLink>
                        <SubmenuTrigger/>
                    </div>
                </div>
                {
                    products.length !== 0 && products.flatMap((product) => (
                    <Collapse in={activeCollapse === order._id}>
                        <table className="basic-table">
                            <tbody>
                            <tr>
                                <td colSpan={2}>Product</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="flex gap-6">
                                        <div className="img-wrapper w-[70px] h-[64px] flex items-center justify-center">
                                            <img src={product.img_link[0]} alt={product.product_name}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <h5 className="text-sm mb-1.5">{product.product_name}</h5>
                                            <div className="flex flex-col gap-1 text-sm text-body-text">
                                                <p>Regular price: ${product.product_price}</p>
                                                {product._id && <p>Sale price: ${product.product_discounted_price}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>SKU</td>
                                <td>{product.product_id}</td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td className="capitalize">{product.product_category.replace(/\|/g, ', ')}</td>
                            </tr>
                            <tr>
                                <td>Product Name</td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-heading font-bold text-header">
                                            {product.product_name}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td className="capitalize">
                                    <span className="font-heading text-2xl font-bold text-header mr-10">
                                        ${product.product_discounted_price}
                                    </span>
                                    <span className='line-through'>${product.product_price}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Rate</td>
                                <td>
                                <div className="flex justify-center">
                                    <RatingStars rating={product.product_ratingAverage}/>
                                </div>                            
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Collapse>))
                }
            </div>
        )
    }else if(role=== 'shop'){
        return (
            <div className="card">
                <div className="flex items-center justify-between">
                    <span className="subheading-2">{order.order_trackingNumber}</span>
                    <div className="flex flex-col mx-5 w-48">
                        <span className="font-heading font-bold text-header">
                            {status !== 'Fully paid' && `$ ${order.order_payment.received} Paid `}
                            $ {order.order_payment.amount}
                        </span>
                        <span>{status}</span>
                    </div>
                    <div className="flex flex-col mx-5 w-32">
                        <span className="font-heading font-bold text-header">
                            ${order.order_checkout.totalPrice}
                        </span>
                        <span>${order.order_checkout.totalCheckout}</span>
                    </div>
                    <div className="flex flex-col mx-5">
                        <span>Total Discount</span>
                        <span className="font-heading font-bold text-header">
                            ${order.order_checkout.totalDiscount}
                        </span>
                    </div>
                    <div className="flex flex-col mx-5">
                        <span>Free Ship</span>
                        <span className="font-heading font-bold text-header">
                            ${order.order_checkout.freeShip}
                        </span>
                    </div>
                    {role==='shop' && (
                        <span className="badge-status badge-status--lg mx-5"
                            style={{
                                backgroundColor: `var(--${getStatusColor(order.order_status)})`,
                                width: '15%'
                            }}
                            onClick={handleChangeStatus}
                            >
                            {order.order_status.includes('|') ? (order.order_status.split('|')[0]+" "+order.order_status.split('|')[1].split('.')[0]+" %") : order.order_status}
                        </span>
                    )}
                    {(role==='user' || role==='user') && (
                        <span className="badge-status badge-status--lg mx-5"
                            style={{
                                backgroundColor: `var(--${getStatusColor(order.order_status)})`,
                                width: '15%'
                            }}
                            >
                            {order.order_status}
                        </span>
                    )}
                    <div className="flex items-center gap-4">
                        <button className={`collapse-btn ${activeCollapse === order._id+order.order_products.item_products[0].productId ? 'active' : ''}`}
                                aria-label="Toggle view"
                                onClick={() => handleCollapse(order._id+order.order_products.item_products[0].productId)}>
                            <i className="icon icon-caret-down-solid"/>
                        </button>
                        <NavLink to="/product-editor" aria-label="Edit">
                            <i className="icon icon-pen-to-square-regular"/>
                        </NavLink>
                        <SubmenuTrigger/>
                    </div>
                </div>
                {
                    products.length !== 0 && products.flatMap((product) => (
                    <Collapse in={activeCollapse === order._id+order.order_products.item_products[0].productId}>
                        <table className="basic-table">
                            <tbody>
                            <tr>
                                <td colSpan={2}>Product</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="flex gap-6">
                                        <div className="img-wrapper w-[70px] h-[64px] flex items-center justify-center">
                                            <img src={product.img_link[0]} alt={product.product_name}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <h5 className="text-sm mb-1.5">{product.product_name}</h5>
                                            <div className="flex flex-col gap-1 text-sm text-body-text">
                                                <p>Regular price: ${product.product_price}</p>
                                                {product._id && <p>Sale price: ${product.product_discounted_price}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>SKU</td>
                                <td>{product.product_id}</td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td className="capitalize">{product.product_category.replace(/\|/g, ', ')}</td>
                            </tr>
                            <tr>
                                <td>Product Name</td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-heading font-bold text-header">
                                            {product.product_name}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td className="capitalize">
                                    <span className="font-heading text-2xl font-bold text-header mr-10">
                                        ${product.product_discounted_price}
                                    </span>
                                    <span className='line-through'>${product.product_price}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Rate</td>
                                <td>
                                <div className="flex justify-center">
                                    <RatingStars rating={product.product_ratingAverage}/>
                                </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Collapse>))
                }
            </div>
        )
    }
    
}

OrderCollapseItem.propTypes = {
    order: PropTypes.object.isRequired,
    activeCollapse: PropTypes.string.isRequired,
    handleCollapse: PropTypes.func.isRequired
}

export default OrderCollapseItem