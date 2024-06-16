// components
import Spring from '@components/Spring';
import Pagination from '@ui/Pagination';
import OrderCollapseItem from '@components/OrderCollapseItem';

// hooks
import usePagination from '@hooks/usePagination';
import {useEffect, useState} from 'react';
import {useWindowSize} from 'react-use';
import axiosClient from '@api/axiosClient';


const OrdersTable = ({category, sort, orders = [], role}) => {
    const {width} = useWindowSize();
    const [activeCollapse, setActiveCollapse] = useState('');

    const filteredData = category.value === 'All' ? orders : orders.filter(order => order.category === category.value);

    const sortedData = () => {
        switch (sort.value) {
            default:
            case 'default':
                return filteredData;
            case 'a-z':
                return filteredData.sort((a, b) => a.product.name.localeCompare(b.product.name));
            case 'z-a':
                return filteredData.sort((a, b) => b.product.name.localeCompare(a.product.name));
            case 'rating-high-to-low':
                return filteredData.sort((a, b) => b.rating - a.rating);
            case 'rating-low-to-high':
                return filteredData.sort((a, b) => a.rating - b.rating);
        }
    }

    const pagination = usePagination(sortedData(), 5);

    // go to first page when period or sort changes and reset active collapse
    useEffect(() => {
        pagination.goToPage(0);
        setActiveCollapse('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, sort]);

    // reset active collapse when page or window width changes
    useEffect(() => {
        setActiveCollapse('');
    }, [pagination.currentPage, width]);

    const handleCollapse = (sku) => {
        if (activeCollapse === sku) {
            setActiveCollapse('');
        } else {
            setActiveCollapse(sku);
        }
    }

    return (
        <Spring className="flex flex-col flex-1 w-full">
            <div className="flex flex-1 flex-col gap-5 mb-[26px]">
                {
                    orders.length !== 0 && orders.map(order => (
                        <OrderCollapseItem 
                            // key={order._id+order.order_products.item_products[0].productId}
                            order={order}
                            activeCollapse={activeCollapse}
                            handleCollapse={handleCollapse}
                            role={role}
                        />
                    ))
                }
            </div>
            {
                pagination.maxPage > 1 && <Pagination pagination={pagination}/>
            }
        </Spring>
    )
}

export default OrdersTable