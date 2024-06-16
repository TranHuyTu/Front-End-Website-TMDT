// components
import Spring from '@components/Spring';
import SubmenuTrigger from '@ui/SubmenuTrigger';
import RatingStars from '@ui/RatingStars';
import {NavLink, useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import axiosClient from '@api/axiosClient';

const ProductGridItem = ({ product, isDraft, index, isSlide, role }) => {
    const navigate = useNavigate();
    const Wrapper = isSlide ? 'div' : Spring;
    const wrapperProps = isSlide ? {} : {type: 'slideUp', index};

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
                productId: product.product_id,
                shopId: product.product_shop,
                quantity:1,
                productType:"default",
                name: product.product_name,
                price: product.product_price
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

    return (
        <Wrapper className="card flex flex-col h-full" {...wrapperProps}>
            <div className="flex items-start gap-[14px] mb-2.5">
                <div className="img-wrapper flex flex-1 items-center justify-center" style={{
                    width: '200px', height: '200px', overflow: 'hidden'
                }}>
                    <img src={product.img_link[0]} alt={product.product_name} style={{
                        width: '80%', height: '80%', objectFit: 'contain'
                    }}/>
                </div>
                <SubmenuTrigger/>
            </div>
            <NavLink className={`!leading-[1.4] block max-w-[180px] transition hover:text-accent ${isSlide ? 'mb-3' : ''}` }
                     to={`/product-detail/${product._id}`}
                     style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 2,
                        lineHeight: '1.5em', 
                        maxHeight: 'calc(1.5em * 4)', 
                        color: 'inherit', 
                        textDecoration: 'none'
                        }}>
                {product.product_name}
            </NavLink>
            <RatingStars rating={product.product_ratingAverage}/>
            <div className={`flex flex-col flex-1 ${isSlide ? 'gap-1 mt-1.5' : 'gap-2.5 mt-2.5'}`}>
                <p className="font-bold text-sm leading-[1.4] text-green">
                    Available : {product.product_quantity[0].quantity || 0}
                </p>
                <p className="font-bold text-sm leading-[1.4] text-accent">
                    Already sold : {product.sold || 0}
                </p>
                {
                    !isSlide && (
                        <>
                            <p className="font-heading font-bold text-sm leading-[1.4] line-through">
                                Regular price : ${product.product_price || 0}
                            </p>
                            <p className="font-heading font-bold text-sm leading-[1.4]">
                                Sale price : ${product.product_discounted_price || 0}
                            </p>
                        </>
                    )
                }
            </div>
            {
                !isSlide && role==='shop' && isDraft !== true && (
                    <div className="grid grid-cols-2 gap-1.5 mt-4">
                        <NavLink className="btn btn--outline blue !text-sm" to={`/product-editor/${product._id}`}>
                            <i className="icon icon-pen-solid text-xs"/> Edit
                        </NavLink>
                        <NavLink className="btn btn--outline blue !text-sm" >
                            <i className="icon icon-pen-solid text-xs"/> Draft
                        </NavLink>
                        <button className="btn btn--outline red !text-sm" onClick={async()=>{}}>Delete</button>
                    </div>
                )
            }
            {
                !isSlide && role==='shop' && isDraft === true && (
                    <div className="grid grid-cols-2 gap-1.5 mt-4">
                        <NavLink className="btn btn--outline blue !text-sm" to={`/product-editor/${product._id}`}>
                            <i className="icon icon-pen-solid text-xs"/> Edit
                        </NavLink>
                        <NavLink className="btn btn--outline blue !text-sm" to={`/product-editor/${product._id}`}>
                            <i className="icon icon-pen-solid text-xs"/> PubLish
                        </NavLink>
                        <button className="btn btn--outline red !text-sm" onClick={async()=>{
                            
                        }}>Delete</button>
                    </div>
                )
            }
            {
                !isSlide && role ==='user' && isDraft !== true && (
                    <div className="grid grid-cols-2 gap-1.5 mt-4">
                        <NavLink className="btn btn--outline blue !text-sm" to="/cart-order" onClick={handleAddToCart}>
                            <i className="icon icon-pen-solid text-xs"/> Add Cart
                        </NavLink>
                        <button className="btn btn--outline red !text-sm">Order</button>
                    </div>
                )
            }
        </Wrapper>
    )
}

export default ProductGridItem