// components
import PageHeader from '@layout/PageHeader';
import CalendarSelector from '@components/CalendarSelector';
import Select from '@ui/Select';
import OrdersAverageRate from '@widgets/OrdersAverageRate';
import OrdersInfobox from '@components/OrdersInfobox';
import OrdersTable from '@widgets/OrdersTable';

// hooks
import {useEffect, useState} from 'react';

// constants
import {PRODUCT_CATEGORIES, ORDER_SORT_OPTIONS} from '@constants/options';
import axiosClient from '@api/axiosClient';
import Loader from '@components/Loader';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
    const [sort, setSort] = useState(ORDER_SORT_OPTIONS[0]);
    const [role, setRole] = useState();
    const [orders, setOrders] = useState([]);

    useEffect(() =>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    },[category])

    const fetchData = async () => {
        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        setRole(roleUser.roleName);
        if(roleUser.roleName === 'user'){
            const Order = await axiosClient
            .post(`/checkout/user/${roleUser.userId}`, {},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            setOrders(Order);
        }else if(roleUser.roleName === 'shop'){
            const Order = await axiosClient
            .post(`/checkout/shop/${JSON.parse(sessionStorage.getItem('x-client-id'))}`, {},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

            setOrders(Order);
        }
    }

    if(role){
        const countCompleted = orders.filter(order => order.order_status === 'completed').length;
        const countPending = orders.filter(order => order.order_status === 'pending').length;
        const countShipped = orders.filter(order => order.order_status === 'shipped').length;
        const countShipping = orders.filter(order => order.order_status === 'shipping').length;
        const countCanceled = orders.filter(order => order.order_status === 'canceled').length;
        const countRefunded = orders.filter(order => order.order_status === 'refunded').length;
        return (
        <>
            <PageHeader title="Orders"/>
            <div className="flex flex-col flex-1 gap-5 md:gap-[26px]">
                <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[26px] lg:grid-cols-4 lg:items-end
                     xl:grid-cols-6">
                    <CalendarSelector wrapperClass="lg:max-w-[275px] lg:col-span-2 xl:col-span-4"
                                      id="ordersPeriodSelector"/>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[26px] md:col-span-2">
                        <Select value={category}
                                options={PRODUCT_CATEGORIES}
                                onChange={setCategory}
                                placeholder="Product category"/>
                        <Select value={sort}
                                options={ORDER_SORT_OPTIONS}
                                onChange={setSort}
                                placeholder="Default sorting"/>
                    </div>
                </div>
                <div className="w-full widgets-grid grid-cols-1 xl:grid-cols-8" style={{display: 'flex'}}>
                    <div className="xl:col-span-2">
                        <OrdersAverageRate/>
                    </div>
                    <div className="widgets-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:col-span-4" style={{display: 'flex'}}>
                        <OrdersInfobox title="Completed"
                                       count={countCompleted}
                                       icon={<i className="icon-check-to-slot-solid"/>}/>
                        <OrdersInfobox title="Shipped"
                                       count={countShipped}
                                       color="orange"
                                       icon={<i className="icon-ban-solid"/>}/>
                        <OrdersInfobox title="Pending"
                                       count={countPending}
                                       color="green"
                                       icon={<i className="icon-list-check-solid"/>}/>
                        <OrdersInfobox title="Shipping"
                                       count={countShipping}
                                       color="yellow"
                                       icon={<i className="icon-ban-solid"/>}/>
                        <OrdersInfobox title="Canceled"
                                       count={countCanceled}
                                       color="red"
                                       icon={<i className="icon-ban-solid"/>}/>
                        <OrdersInfobox title="Refunded"
                                       count={countRefunded}
                                       color="badge-status-bg"
                                       icon={<i className="icon-rotate-left-solid"/>}/>
                    </div>
                </div>
                <OrdersTable category={category} sort={sort} orders={orders} role={role}/>
            </div>
        </>
    )
    }else{
        return (<Loader />)
    }
    
}

export default Orders