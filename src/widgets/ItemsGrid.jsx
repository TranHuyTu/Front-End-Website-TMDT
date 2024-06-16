// components
import ProductGridItem from '@components/ProductGridItem';
import Select from '@ui/Select';
import Pagination from '@ui/Pagination';
import CategoryHeader from '@ui/CategoryHeader';

// hooks
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';

// constants
import {PRODUCT_CATEGORIES, PRODUCT_SORT_OPTIONS} from '@constants/options';

// utils
import {sortProducts} from '@utils/helpers';

// data placeholder
// import products from '@db/products';

const ItemsGrid = ({products,isDraft, role, setCategoryNew, onRequestNextPage, onRequestReturnPage, page}) => {
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
        <>
            <div className="grid gap-[26px] lg:grid-cols-4 2xl:grid-cols-6" 
            style={{
                justifyContent:'center', alignItems: 'center'
                }}>
                <div className="card !p-5 flex items-center gap-4 min-w-[218px]" style={{height: '55px'}}>
                    <CategoryHeader category={category.value}/>
                </div>
                <div className="flex flex-col-reverse gap-4 lg:flex-col lg:gap-3 lg:col-start-3 lg:col-end-5
                     2xl:col-start-5 2xl:col-end-7">
                    <span className="lg:text-right">View products: {pagination.showingOf()}</span>
                    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-[26px]">
                        <Select value={category} onChange={setCategory} options={options}/>
                        <Select value={sort} onChange={setSort} options={PRODUCT_SORT_OPTIONS}/>
                    </div>
                </div>
            </div>
            <div className="grid flex-1 items-start gap-[26px] mt-5 mb-[30px] sm:grid-cols-2 md:grid-cols-3
                 lg:grid-cols-4 2xl:grid-cols-6">
                {
                    pagination.currentItems().map((product, index) => (
                        <ProductGridItem key={`${product._id}-${sort.value}-${category.value}`} product={product} isDraft={isDraft} index={index} role={role}/>
                    ))
                }
            </div>
            {
                pagination.maxPage > 1 && <Pagination pagination={pagination} onRequestNextPage={onRequestNextPage} onRequestReturnPage={onRequestReturnPage} page={page}/>
            }
        </>
    )
}

export default ItemsGrid