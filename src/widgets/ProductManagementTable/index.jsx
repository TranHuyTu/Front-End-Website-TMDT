// components
import FilterItem from '@ui/FilterItem';
import Select from '@ui/Select';
import StyledTable from './styles';
import Empty from '@components/Empty';
import Pagination from '@ui/Pagination';
import ProductManagementCollapseItem from '@components/ProductManagementCollapseItem';

// hooks
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';

// constants
import {PRODUCT_CATEGORIES, PRODUCT_SORT_OPTIONS} from '@constants/options';
import {sortProducts} from '@utils/helpers';


import {PRODUCTS_MANAGEMENT_COLUMN_DEFS} from '@constants/columnDefs';

const ProductManagementTable = ({products, role, handleSetPublish, setCategoryNew, onRequestNextPage, onRequestReturnPage, page}) => {
    const options = PRODUCT_CATEGORIES;
    const [category, setCategory] = useState(options[0]);
    const [sort, setSort] = useState(PRODUCT_SORT_OPTIONS[0]);
    
    let productsByCategory
    if(category.value === 'All'){
        productsByCategory = products;
    }else{
        productsByCategory = products.filter(product => product.product_type === category.value);
    }

    const sortedProducts = sortProducts(productsByCategory, sort.value);
    const pagination = usePagination(sortedProducts, 12);

    useEffect(() => {
        pagination.goToPage(0);
        setCategoryNew(category.value);
    }, [category, sort]);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-header">Products:</span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-x-2 xl:grid-cols-2">
                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-[26px]">
                        <Select value={category} onChange={setCategory} options={options}/>
                        <Select value={sort} onChange={setSort} options={PRODUCT_SORT_OPTIONS}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="btn btn--outline blue !h-[44px]" onClick={handleSetPublish}>
                        Publish
                    </button>
                </div>
            </div>
            <div
                className="flex flex-col-reverse gap-4 mt-4 mb-5 md:flex-row md:justify-between md:items-end md:mt-5 md:mb-6">
                <p>
                    View products: {pagination.showingOf()}
                </p>
            </div>
            <div className="flex flex-1 flex-col gap-[22px]">
                <StyledTable columns={PRODUCTS_MANAGEMENT_COLUMN_DEFS}
                             dataSource={pagination.currentItems()}
                             rowKey={record => record.sku}
                             locale={{
                                 emptyText: <Empty text="No products found"/>
                             }}
                             rowSelection={{
                                 type: 'checkbox',
                             }}
                             pagination={false}/>
                {
                    pagination.maxPage > 1 && <Pagination pagination={pagination} onRequestNextPage={onRequestNextPage} onRequestReturnPage={onRequestReturnPage} page={page}/>
                }
            </div>
        </div>
    )
}

export default ProductManagementTable