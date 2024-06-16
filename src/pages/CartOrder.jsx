// components
import PageHeader from '@layout/PageHeader';
import Search from '@ui/Search';
import CartManagementTable from '@widgets/CartManagementTable';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { useNavigate } from 'react-router-dom';

const CartOrder = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loadNextPage, setLoadNextPage] = useState(false);
    const [loadReturnPage, setLoadReturnPage] = useState(false);
    const [role, setRole] = useState();
    const navigate = useNavigate();

    useEffect(() =>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
        if (loadNextPage) {
            fetchData();
            setLoadNextPage(false);
        }
    },[loadNextPage, loadReturnPage, page])

    const handleRequestNextPage = () => {
        setPage((prevPage) => prevPage + 1);
        setLoadNextPage(true);
    };

    const handleRequestReturnPage = () => {
        if(page > 1){
            setPage((prevPage) => prevPage - 1);
            setLoadReturnPage(true);
        }  
    };

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
            const cartOrder = await axiosClient
            .get(`cart?userId=${roleUser.userId}`,
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });

            const productPromises = cartOrder.cart_products.map(async productDetail => {
                    const result = await axiosClient.get(`/product/num/${productDetail.productId}`, {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            // 'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            // 'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                    });
                    result.Type = productDetail.productType;
                    result.Quantity = productDetail.quantity;
                    return result;
                })

            const productResults = await Promise.all(productPromises);

            console.log(productResults);

            setProducts(productResults);
        }else{
            navigator('/login');
        }
    };
    if(products && role){
         return (
        <>
            <PageHeader title="Products Management" />
            <div className="flex flex-col-reverse gap-4 mb-5 md:flex-col lg:flex-row lg:justify-between">
                <Search wrapperClass="lg:w-[326px]" placeholder="Search Product"/>
            </div>
            <CartManagementTable products={products} role = {role} onRequestNextPage={handleRequestNextPage} onRequestReturnPage={handleRequestReturnPage} page={page}/>
        </>
    )
    }else{
        return (<Loader />)
    }
   
}

export default CartOrder