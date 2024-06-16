// components
import PageHeader from '@layout/PageHeader';
import CustomersInfobox from '@components/CustomersInfobox';
import ReviewsRate from '@widgets/ReviewsRate';
import LatestAcceptedReviews from '@widgets/LatestAcceptedReviews';
import ReviewsScore from '@widgets/ReviewsScore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@api/axiosClient';
import Search from '@ui/Search';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions } from '@mui/material';
import { Button } from 'antd';


const Reviews = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [listProducts, setListProducts] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    }, [])
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
        if(roleUser.roleName !== 'shop'){
            const productList = await axiosClient
                .get(`/product?page=${page}`,
                {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                });
                setProducts(productList);
        }else{
            const productList = await axiosClient
            .get(`/product/published/all?page=${page}`,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                },
            });
            setProducts(productList);
        }
    }

    const handleScroll = async(event) => {
        const { target } = event;
       
        if (parseInt(target.scrollHeight - target.scrollTop) === target.clientHeight) {
            
            const productList = await axiosClient
                .get(`/product/published/all?page=${page+1}`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                    },
                });
            if(productList){
                setPage(page+1);
                setProducts([...products,...productList]);
            }  
        }
    };

    return (
        <>
            <PageHeader title="Reviews"/>
            <div className="flex flex-col flex-1 gap-5 md:gap-[26px]">
                <Search wrapperClass="lg:w-[326px]" placeholder="Search Product"/>
                <div className='flex flex-nowrap overflow-auto' style={{height: '300px'}} onScroll={handleScroll}>
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-8 mt-8 w-full h-full">
                        {
                            products.map((product) => (
                                <Card sx={{ maxHeight: 300 , minHeight: 280 }} style={{position:'relative'}}>
                                    <CardMedia
                                        component="img"
                                        alt={product.product_name}
                                        image={product.img_link[0]}
                                        style={{height: '100px', objectFit: 'contain'}}
                                    />
                                    <CardContent>
                                        <Typography className='line-clamp-2' gutterBottom component="div">
                                        {product.product_name}
                                        </Typography>
                                        <Typography className='line-clamp-2' variant="body2" color="text.secondary">
                                        {product.product_description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" className='' 
                                        onClick={async()=>{
                                            const element = document.getElementById(product._id);
                                            setListProducts(product._id);
                                            const commentList = await axiosClient
                                                    .get(`/comment/byProduct?productId=${product._id}`,
                                                    {
                                                        headers: {
                                                            'content-type': 'application/x-www-form-urlencoded',
                                                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                                                        },
                                                    });
                                                
                                            const product2 = await axiosClient
                                                .get(`/product/${product._id}`,
                                                {
                                                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                                                });
                                                
                                            const commentListResult = commentList.map((comment) => {
                                                    const cmt = comment;
                                                    cmt.rating = product2.product_ranking.filter((rating) => rating.comment_id === cmt.id);
                                                    return cmt;
                                                })
                                            console.log(commentListResult);
                                            element.style.display = 'block';
                                        }}>
                                            Show
                                        </Button>
                                    </CardActions>
                                    <div id={product._id} className={'bg-slate-400 w-full h-full top-0 left-0'} style={{position: 'absolute', opacity: '0.5', display: 'none'}}>
                                        <Button className='h-8 w-8 relative' 
                                        onClick={()=>{
                                            const filteredArray = listProducts.filter(value => value !== product._id);
                                            setListProducts(filteredArray);
                                            const element = document.getElementById(product._id);
                                            element.style.display = 'none';
                                        }}>
                                            <svg className="h-8 w-8 text-red-500 absolute top-0 left-0"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  
                                                <path stroke="none" d="M0 0h24v24H0z"/>  
                                                <line x1="18" y1="6" x2="6" y2="18" />  
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </Button>
                                        <div className=''>
                                            <svg className="h-30 w-30 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                                                <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" />  
                                                <polyline points="8 10 12 14 16 10" />
                                            </svg>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                </div>
                <LatestAcceptedReviews/>
            </div>
        </>
    )
}

export default Reviews