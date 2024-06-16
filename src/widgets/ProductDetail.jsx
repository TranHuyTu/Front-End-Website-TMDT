// components
import Spring from '@components/Spring';

// hooks
import { useEffect, useState } from 'react';

// constants

// utils

// import * as React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import RatingStars from '@ui/RatingStars';
import { Autocomplete, Rating, TextField } from '@mui/material';
import axiosClient from '@api/axiosClient';
import CommentDetail from '@components/CommentDetail';
import Loader from '@components/Loader';
import ProductGridItem from '@components/ProductGridItem';
import { Avatar } from 'antd';
import axios from 'axios';
import {toast} from 'react-toastify';

const ProductDetail = () => {
    const [productSearch, setProductSearch] = useState([]);
    const [shop, setShop] = useState([]);
    let { productId } = useParams();
    const [rating_item, setRatingItem] = useState(0);
    const [rating_shipping, setRatingShipping] = useState(0);
    const [rating_service, setRatingService] = useState(0);
    const [comment, setComment] = useState('');
    const [productDetail, setProductDetail] = useState();
    const [quantityStock, setQuantityStock] = useState(productDetail?productDetail.product_quantity[0].quantity:0);
    const [type, setType] = useState(productDetail?productDetail.product_quantity[0].type:'default');
    const [quantity, setQuantity] = useState(1);
    const [reloadKey, setReloadKey] = useState(0);
    const [parentCommentId, setParentCommentId] = useState();

    const navigate = useNavigate();

    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    }, [])
    const fetchData = async () => {
        await axiosClient
            .post(`/product/addView`,{
                productId: productId
            },
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        const result = await axiosClient
            .get(`/product/${productId}`,
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
        setProductDetail(result);

        const shopDetail = await axiosClient
            .post(`/user/shop?userId=${result.product_shop}`,{},
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        setShop(shopDetail);

        const search = await axiosClient
            .get(`/product?page=1`,
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
        setProductSearch([...search.slice(0, 10)]);

        const comment = await axiosClient
            .get(`/comment?productId=${result._id}`,
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        if(comment.length !== 0){
            setParentCommentId(comment[0]._id);
        }else{
            const roleUser = await axiosClient
                .post(`/user/role`,{},
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });

            const commentNew = {
                productId: result._id,
                userId: roleUser.userId,
                content: 'Welcome to the Shopping Product :: '+result.product_name,
                parentCommentId: null
            }
            const commentNewResult = await axiosClient
                .post(`/comment`, commentNew,
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
            setParentCommentId(commentNewResult._id);
        }
    }

    const options = Array.from({ length: 500 }, (_, i) => i + 1);
    const getOptionLabel = (option) => {
        return String(option);
    };

    const getOptionType = (option) => {
        return String(option);
    };
    let optionTypes = [];
    if(productDetail){
        const SubString  = productDetail.product_description.split('|');

        const Str = SubString.map((value,index)=>{
            if(index !== 0){
                value.split(':');
                return `<div class = "flex"><p class = "font-bold">${value.split(':')[0]} :</p><spam class = "ml-4">${value.split(':')[1]}</spam></div>`
            }
            return `${value}`
        })
        const element =document.getElementById('description');

        if(element){
            element.innerHTML = Str.join('\n')
        }
        
        optionTypes = productDetail.product_quantity.map(item => item.type);
    } 
    const changType = (event, newValue) => {
        setType(newValue);
        const quan = productDetail.product_quantity.find(item => item.type === newValue);
        if(quan.quantity){
            setQuantityStock(quan.quantity);
        }
        else{
            setQuantityStock(productDetail.product_quantity[0].quantity);
        }
    }
    const changQuantity = (event, newValue) => {
        setQuantity(newValue);
    }

    const handleChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmitComment = async(event) =>{
        event.preventDefault();
        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

        const commentNew = {
            productId: productDetail._id,
            userId: roleUser.userId,
            content: comment,
            parentCommentId: parentCommentId
        }
        const commentNewResult = await axiosClient
            .post(`/comment`, commentNew,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

        const dataRanking = {
            productId: productId, 
            commentId: commentNewResult._id, 
            item_quality: rating_item, 
            shipping: rating_shipping, 
            customer_service: rating_service
        }
        const ranking = await axiosClient
            .post(`/product/addRanking`, dataRanking,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(ranking){
            setComment("");
        }
        console.log(reloadKey);
        setReloadKey(prevKey => prevKey + 1);
    }

    const handleAddToCart = (event) => {
        event.preventDefault(); 

        const proNew = addProductToCart();

        proNew.then(data=> {
            if(data.cart_userId) {
                navigate('/cart-order');
            } 
        });
    };

    const addProductToCart = async()=>{
        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        const data = {
            userId: roleUser.userId,
            product: {
                productId: productDetail.product_id,
                shopId: productDetail.product_shop,
                quantity: quantity,
                productType: type,
                name: productDetail.product_name,
                price: productDetail.product_price
            }
        }

        const productNew = await axiosClient
            .post(`/cart`,data,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        return await productNew;
    }

    const handleSub = async () =>{
        const follow = await axiosClient
            .post(`/follow/findFollow`,{
                userId: JSON.parse(sessionStorage.getItem('x-client-id')).replace(/"/g, ''),
                shopId: productDetail.product_shop
            },
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(follow){
            const deleteFollow = await axiosClient.delete(`/follow`,{data :{
                userId: follow.userId,
                shopId: follow.shopId
                }
            },
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

            if(deleteFollow){
                toast.success('Unfollow shop successfully');
            }
        }else{
            const sub = await axios.post('http://localhost:9000/v1/api',{
                userId: JSON.parse(sessionStorage.getItem('x-client-id')).replace(/"/g, ''),
                shopId: productDetail.product_shop
            },{
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                },
            });
            if(sub.data.metadata){
                const FollowNew = await axiosClient.post(`/follow`,sub.data.metadata,
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
                if(FollowNew){
                    toast.success('Follow shop successfully');
                }
            }
        }
    }

    if (!productDetail || !shop) return <Loader/>;
    else{
        return (
            <Spring className="card flex-1 xl:py-10">
                <div className="widgets-grid grid-cols-1 md:grid-cols-2
                        2xl:grid-cols-[minmax(0,_584px)_minmax(0,_462px)_minmax(0,_1fr)]">
                    <div className="block grid-cols-1 md:grid-cols-2 md:gap-[26px] md:col-span-2 lg:col-span-1">                    
                        <img className='' src={productDetail.img_link[0]} alt={productDetail.product_name} style={{
                            width: '60%',
                            height: '500px',
                            objectFit:'contain'
                        }}/>
                        <div className='flex items-center pl-4 py-4 my-8 shadow-2xl'>
                            {shop.avatar!== '' &&  <Avatar className='border-2 border-amber-500' alt={shop.first_name + shop.last_name} src={shop.avatar} style={{width:'50px', height:'50px'}}/>}
                            {shop.avatar=== '' &&  <Avatar className='border-2 border-amber-500' alt={shop.first_name + shop.last_name} src='https://res.cloudinary.com/dbaul3mwo/image/upload/v1718494660/IMAGE_SHOP/R_1_xzyhmk.jpg' style={{width:'50px', height:'50px'}}/>}
                            <div>
                                <NavLink className={`ml-4 !leading-[1.4] block max-w-[180px] transition hover:text-accent font-bold` }
                                    to={`/products-shop/${productDetail.product_shop}`}>
                                    {shop.first_name} {shop.last_name}
                                </NavLink>
                                <p className='ml-4 text-yellow-700 mr-4'>{shop.email}</p>
                            </div>
                            <NavLink className="btn btn--outline blue !text-sm mt-4" onClick={handleSub}>
                                Follow Shop
                            </NavLink>
                        </div>
                        <Spring className="card flex flex-col lg:col-span-3 xl:col-span-1 mt-4 border-2 border-amber-500">
                            <section className="bg-white dark:bg-gray-900 lg:py-16 antialiased" style={{padding: '0'}}>
                                <div className="max-w-2xl mx-auto px-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Comment</h2>
                                    </div>
                                    <form className="mb-6">
                                        <div className='flex my-2'>
                                            <p className='font-bold text-yellow-700 mr-4' component="legend">Item quality</p>
                                            <Rating
                                                name="simple-controlled"
                                                value={rating_item}
                                                onChange={(event, newValue) => {
                                                    setRatingItem(newValue);
                                                }}
                                            />
                                        </div>
                                        <div className='flex my-2'>
                                            <p className='font-bold text-yellow-700 mr-4' component="legend">Shipping</p>
                                            <Rating
                                                name="simple-controlled"
                                                value={rating_shipping}
                                                onChange={(event, newValue) => {
                                                    setRatingShipping(newValue);
                                                }}
                                            />
                                        </div>
                                        <div className='flex my-2'>
                                            <p className='font-bold text-yellow-700 mr-4' component="legend">Customer service</p>
                                                <Rating
                                                name="simple-controlled"
                                                value={rating_service}
                                                onChange={(event, newValue) => {
                                                    setRatingService(newValue);
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border-solid border-2 border-indigo-600">
                                            <label htmlFor="comment" className="sr-only">Your comment</label>
                                            <textarea id="comment" rows="2"
                                                className="px-0 w-full text-sm text-gray-900 border-1 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                                placeholder="Write a comment..." required
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                        <button type="submit"
                                            onClick={handleSubmitComment}
                                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
                                            style={{background: '#1972f5'}}>
                                            Post comment
                                        </button>
                                    </form>
                                    {
                                        parentCommentId && <CommentDetail key={reloadKey} commentParent={parentCommentId} productId={productId}/>
                                    }
                                </div>
                            </section>
                        </Spring>             
                    </div>
                    <div className="widgets-grid grid-cols-1 md:gap-[26px] md:col-span-2 lg:col-span-1" style={{display: 'block'}}>
                        <NavLink className={`h6 !leading-[1.4] block transition hover:text-accent 'mb-3' : ''}` }>
                            {productDetail.product_name}
                        </NavLink>
                        <RatingStars rating={productDetail.product_ratingAverage}/>
                        <div className={`flex flex-col flex-1  'gap-1 mt-1.5' : 'gap-2.5 mt-2.5'}`}>
                            <Spring className="card flex flex-col lg:col-span-3 xl:col-span-1">
                                <p className="font-heading font-bold text-sm leading-[1.4] text-green">
                                    Available : {quantityStock? quantityStock:0}
                                </p>
                                <p className="font-heading font-bold text-sm leading-[1.4] text-accent">
                                    Already sold : {productDetail.sold || 0}
                                </p>
                            </Spring>
                            <Spring className="card flex flex-col lg:col-span-3 xl:col-span-1 mt-4">
                                <p className="font-heading font-bold text-sm leading-[1.4] line-through">
                                    ${quantity*productDetail.product_price || productDetail.product_price}
                                </p>
                                <p className="font-heading font-bold text-sm leading-[1.4]">
                                    ${quantity*productDetail.product_discounted_price || productDetail.product_discounted_price}
                                </p>
                            </Spring>
                            <Autocomplete
                            className='mt-4'
                            disablePortal
                            id="combo-box-demo"
                            options={optionTypes}
                            getOptionLabel={getOptionType}
                            onChange={changType}
                            renderInput={(params) => <TextField {...params} label="Type" />}
                            value={type}
                            />
                            <Autocomplete
                            className='mt-4'
                            disablePortal
                            id="combo-box-demo"
                            options={options}
                            getOptionLabel={getOptionLabel}
                            onChange={changQuantity}
                            renderInput={(params) => <TextField {...params} label="Quantity" />}
                            value={quantity || 1}
                            />
                            <NavLink className="btn btn--outline blue !text-sm mt-4" to="/cart-order" onClick={handleAddToCart}>
                                <i className="icon icon-pen-solid text-xs"/> Add Cart
                            </NavLink>
                            {/* <NavLink className="btn btn--outline blue !text-sm mt-4" to="/orders">
                                <i className="icon icon-pen-solid text-xs"/> Order Now
                            </NavLink> */}
                            <Spring className="card flex flex-col lg:col-span-3 xl:col-span-1 mt-4">
                                <pre className="product-description font-heading font-bold text-sm leading-[1.4] text-black">
                                    Description product: 
                                </pre>
                                <div id='description' className="no-underline">
                                    <p>{productDetail.product_description || 'Chua cap nhat .....'}</p>
                                </div>
                            </Spring>
                        </div>
                    </div> 
                </div>
                <div className="grid flex-1 items-start gap-[26px] mt-5 mb-[30px] sm:grid-cols-2 md:grid-cols-3 md:mt-7
                    lg:grid-cols-4 2xl:grid-cols-6 overflow-x-auto" style={{display: 'flex'}}>
                        {
                                productSearch.map((product, index) => (
                                    <ProductGridItem key={`${product._id}`} product={product} index={index} role={"user"}/>
                                ))
                        }
                        </div>  
            </Spring>
        )
    }
   
}

export default ProductDetail