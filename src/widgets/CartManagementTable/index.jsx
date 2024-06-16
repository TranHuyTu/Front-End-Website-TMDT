// components
import Select from '@ui/Select';
import StyledTable from './styles';
import Empty from '@components/Empty';
import Pagination from '@ui/Pagination';
// hooks
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';
import {useWindowSize} from 'react-use';

// constants
import {
    PRODUCT_CATEGORIES,
    PRODUCT_SORT_OPTIONS
} from '@constants/options';
import {PRODUCTS_MANAGEMENT_COLUMN} from '@constants/columnDefs';

import { sortProducts } from '@utils/helpers';
import { NavLink, useNavigate } from 'react-router-dom';

const CartManagementTable = ({products, role, onRequestNextPage, onRequestReturnPage, page}) => {
    const navigate = useNavigate();
    const {width} = useWindowSize();

    const options = PRODUCT_CATEGORIES;
    const [category, setCategory] = useState(options[0]);
    const [sort, setSort] = useState(PRODUCT_SORT_OPTIONS[0]);

    const [totalPrice, setTotalPrice] = useState(0);
    let productsByCategory
    if(category.value === 'All'){
        productsByCategory = products;
    }else{
        productsByCategory = products.filter(product => product.product_type === category.value);
    }
    const sortedProducts = sortProducts(productsByCategory, sort.value);
    const pagination = usePagination(sortedProducts, 8);

    useEffect(() => {
        
        pagination.goToPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, sort]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        if(selectedRowKeys[0]){
            const total = selectedRowKeys.reduce(
                (total, row, index) => (total + parseInt(row.split('-')[1])*selectedRows[index].product_discounted_price), 0);
            setTotalPrice(total);
            console.log(parseInt(selectedRowKeys[0].split('-')[1])*selectedRows[0].product_discounted_price, total)
        }else{
            const total = products.reduce((total, product) => total + product.product_discounted_price*product.Quantity, 0);
            setTotalPrice(total);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleRowSelectionChange,
        type: 'checkbox',
    };
    const handlePayment = (event) => {
        event.preventDefault();

        sessionStorage.setItem('products', JSON.stringify(rowSelection.selectedRowKeys));

        navigate('/payment');
    };
    
    return (
        <div className="flex flex-col flex-1">
            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-[26px]">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-header">Products:</span>
                </div>
                <Select value={category} onChange={setCategory} options={options}/>
            </div>
            <div
                className="flex flex-col-reverse gap-4 mt-4 mb-5 md:flex-row md:justify-between md:items-end md:mt-5 md:mb-6">
                <p>
                    View products: {pagination.showingOf()}
                </p>
            </div>
            <div className="flex flex-1 flex-col gap-[22px]">
            
                {
                    width >= 768 ?
                        <StyledTable columns={PRODUCTS_MANAGEMENT_COLUMN}
                                     dataSource={pagination.currentItems()}
                                     rowKey={record => record.product_id+"-"+record.Quantity+"-"+record.Type+"-"+record.product_discounted_price}
                                     locale={{
                                         emptyText: <Empty text="No products found"/>
                                     }}
                                     rowSelection={rowSelection}
                                     pagination={false}/>:
                                     <></>
                }
                <div className="grid flex-1 items-start gap-[26px] mt-5 mb-[30px] sm:grid-cols-2 md:grid-cols-3 md:mt-7
                 lg:grid-cols-4 2xl:grid-cols-6 overflow-x-auto" style={{display: 'flex', alignItems: 'center'}}>
                    <div className='' style={{display: 'flex', alignItems:'center', justifyContent:'right', width: '50%'}}>
                        <p className="font-heading font-bold text-sm leading-[1.4] mx-5">
                            Total count payout ({selectedRows.length} products)
                        </p>
                        <p className="font-heading font-bold text-sm leading-[1.4] mx-5">
                            {totalPrice}
                        </p>
                    </div>
                    
                    <NavLink className="btn btn--outline blue !text-sm mt-4" style={{margin:'auto'}} onClick={handlePayment}>
                        <i className="icon icon-pen-solid text-xs"/> Order Now
                    </NavLink>
                 </div>
                {/* {
                    pagination.maxPage > 1 && <Pagination pagination={pagination} onRequestNextPage={onRequestNextPage} onRequestReturnPage={onRequestReturnPage} page={page}/>
                } */}
            </div>
        </div>
    )
}

export default CartManagementTable