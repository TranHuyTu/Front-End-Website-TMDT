// components
import PageHeader from '@layout/PageHeader';
import { Autocomplete, TextField } from '@mui/material';
import RatingStars from '@ui/RatingStars';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { NavLink, useNavigate } from 'react-router-dom';

const PaymentPages = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState([]);
    const [dataCheckOut, setdataCheckOut] = useState();
    const [formData, setFormData] = useState({
        Name: '',
        Phone: '',
        Address: '',
        City: '',
        Country: ''
    });
    const [onSave, setOnSave] = useState();
    const [onError, setOnError] = useState();

    const getOptionDiscount = (option) => {
        return String(option);
    };

    useEffect(() =>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    },[])

    const fetchData = async () => {
        const productList = JSON.parse(sessionStorage.getItem('products'));

        const productPromises = productList.map(async productDetail => {
            let splitArray = productDetail.split('-');
            const productId = splitArray[0];
            const productQuantity = splitArray[1];
            const productType = splitArray[2];
            const result = await axiosClient.get(`/product/num/${productId}`, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    // 'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    // 'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            const resultDiscount = await axiosClient.get(`/discount/list_product?shopId=${result.product_shop}&productId=${result._id}`, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            result.Type = productType;
            result.Quantity = productQuantity;
            result.Discounts = resultDiscount;
            return result;
        })

        const productResults = await Promise.all(productPromises);

        setProducts(productResults);

        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(roleUser.roleName === 'user'){
            const cartOrder = await axiosClient
            .get(`cart?userId=${roleUser.userId}`,
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
            const shop_order_ids = productResults.flatMap(product => {
                return {
                        shopId: product.product_shop,
                        shop_discounts: [],
                        item_products: [
                            {
                                price: product.product_discounted_price,
                                quantity: parseInt(product.Quantity),
                                productId: product.product_id,
                                productType: product.Type,
                            }
                        ]
                    }
            })
            let dataCheckout = {
                cartId: cartOrder._id,
                userId: roleUser.userId,
                shop_order_ids
            }

            sessionStorage.setItem('dataCheckout', JSON.stringify(dataCheckout));

            const checkOutData = await axiosClient
            .post(`/checkout/review`, dataCheckout,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

            setdataCheckOut(checkOutData);
        }else{
            navigate('/login');
        }
    }

    const handleCheckOut = async () => {
        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(roleUser.roleName === 'user'){
            const cartOrder = await axiosClient
            .get(`cart?userId=${roleUser.userId}`,
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
            const shop_order_ids = products.map(product => {
                const codeId = discount.find(discount => product.product_id === discount.item_products)
                if(codeId){
                    const discountId = product.Discounts.find(discount => codeId.codeId === discount.discount_code);
                    return {
                        shopId: product.product_shop,
                        shop_discounts: [
                            {
                                shopId: product.product_shop,
                                discountId:discountId._id,
                                codeId:codeId.codeId
                            }
                        ],
                        item_products: [
                            {
                                price: product.product_discounted_price,
                                quantity: product.Quantity,
                                productId: product.product_id,
                                productType: product.Type,
                            }
                        ]
                    }
                }else{
                    return {
                            shopId: product.product_shop,
                            shop_discounts: [],
                            item_products: [
                                {
                                    price: product.product_discounted_price,
                                    quantity: product.Quantity,
                                    productId: product.product_id,
                                    productType: product.Type,
                                }
                            ]
                        }
                }
            })
            let dataCheckout = {
                cartId: cartOrder._id,
                userId: roleUser.userId,
                shop_order_ids
            }

            sessionStorage.setItem('dataCheckout', JSON.stringify(dataCheckout));

            const checkOutData = await axiosClient
            .post(`/checkout/review`, dataCheckout,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

            setdataCheckOut(checkOutData);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name);
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const validateForm = (formData) => {
        let errors = {};

        // Kiểm tra Name
        if (!formData.Name.trim()) {
            console.log(formData.Name.trim());
            errors.name = 'Name is required';
        }

        // Kiểm tra Phone
        const phoneRegex = /^[0-9]{10}$/; // Giả sử số điện thoại gồm 10 chữ số
        console.log(formData.Phone);
        if (!formData.Phone.trim()) {
            console.log("1",formData.Phone.trim());
            errors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.Phone)) {
            console.log(phoneRegex.test(formData.Phone));
            errors.phone = 'Phone is invalid';
        }

        // Kiểm tra Address
        if (!formData.Address.trim()) {
            errors.address = 'Address is required';
        }

        // Kiểm tra City
        if (!formData.City.trim()) {
            errors.city = 'City is required';
        }

        // Kiểm tra Country
        if (!formData.Country.trim()) {
            errors.country = 'Country is required';
        }

        return errors;
    };
    
    const handlePayment = async() => {
        if(onSave){
            const data = {
                amount: dataCheckOut.checkout_order.totalPrice*23000,
                bankCode:"",
                language:"vn"
            }
            const urlPayment = await axiosClient
                .post(`payment/create_payment_url`,data,
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
            window.location.href = urlPayment.url;
        }else{
            setOnError('Error');
        }
    }

    const handleOrder = async() => {
        if(onSave){
            const dataCheck = JSON.parse(sessionStorage.getItem('dataCheckout'));
            const address = JSON.parse(sessionStorage.getItem('user_address'));
            dataCheck.user_address = address;

            dataCheck.user_payment = {
                amount: 0,
                received: parseFloat(dataCheckOut.checkout_order.totalPrice.toFixed(2))
            }
            const result = await axiosClient
                .post(`/checkout/order`,dataCheck,
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
            if(result){
                navigate('/orders');
            }
        }else{
            setOnError('Error');
        }
    }

    if(products.length > 0 && products && dataCheckOut) {
        return (
        <>
            <PageHeader title="Payment"/>
            <div className="flex flex-1 gap-5 md:gap-[26px]">
                <div className="flex bg-gray-100" style={{width:'50%'}}>
                    <div className="">
                        <div>
                            <div className="mt-5 bg-white rounded-lg shadow">
                                <div className="flex">
                                <div className="flex-1 py-5 pl-5 overflow-hidden">
                                    <svg className="inline align-text-top" width="21" height="20.5" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                        <g>
                                            <path d="m4.88889,2.07407l14.22222,0l0,20l-14.22222,0l0,-20z" fill="none" id="svg_1" stroke="null"></path>
                                            <path d="m7.07935,0.05664c-3.87,0 -7,3.13 -7,7c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zm-5,7c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88c-2.08,-2.67 -5,-7.03 -5,-9.88z" id="svg_2"></path>
                                            <circle cx="7.04807" cy="6.97256" r="2.5" id="svg_3"></circle>
                                        </g>
                                    </svg>
                                    <h1 className="inline text-2xl font-semibold leading-none">Receiver</h1>
                                </div>
                                <div className="flex-none pt-2.5 pr-2.5 pl-1"></div>
                                </div>
                                <div className="px-5 pb-5">
                                <input name='Name'  placeholder="Name" onChange={handleChange} className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"/>
                                <input name='Phone' placeholder="Phone" onChange={handleChange} className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"/> 
                                <input name='Address' placeholder="Address" onChange={handleChange} className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"/> 
                                <div className="flex">
                                    <div className="flex-grow w-1/4 pr-2">
                                        <input name='City' placeholder="City" onChange={handleChange} className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"/>
                                        </div>
                                    <div className="flex-grow">
                                        <input name='Country' placeholder="Country" onChange={handleChange} className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"/>
                                        </div>
                                </div>
                                </div>
                                <hr className="mt-4"/>
                                <div className="flex flex-row-reverse p-3">
                                <div className="flex-initial pl-3">
                                    <button type="button" onClick={(event)=>{
                                        const errors = validateForm(formData);
    
                                        if (Object.keys(errors).length === 0) {
                                            sessionStorage.setItem('user_address', JSON.stringify(formData));
                                            setOnError();
                                            setOnSave('Save');
                                        } else {
                                            console.log(errors);
                                            setOnError('Error');
                                        }
                                        
                                    }} className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-black rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                                            <path d="M0 0h24v24H0V0z" fill="none"></path>
                                            <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                                        </svg>
                                        <span className="pl-2 mx-1">Save</span>
                                    </button>
                                </div>
                                <div className="flex-initial">
                                    <button type="button" onClick={(event)=>{
                                        setOnSave();
                                    }} className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                                            <path d="M0 0h24v24H0V0z" fill="none"></path>
                                            <path d="M8 9h8v10H8z" opacity=".3"></path>
                                            <path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
                                        </svg>
                                        <span className="pl-2 mx-1">Delete</span>
                                    </button>
                                </div>
                                </div>
                            </div>
                            {
                                onSave && (
                                    <div className="mt-5 bg-white shadow cursor-pointer rounded-xl">
                                        <div className="flex">
                                        <div className="flex-1 py-5 pl-5 overflow-hidden">
                                            <ul>
                                                <li className="text-xs text-gray-600 uppercase ">Name: {formData.Name}</li>
                                                <li>Phone: {formData.Phone}</li>
                                                <li>address: {formData.Address}</li>
                                                <li>City: {formData.City}</li>
                                                <li>Country: {formData.Country}</li>
                                            </ul>
                                        </div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                onError && (
                                    <div className="mt-5 bg-white shadow cursor-pointer rounded-xl">
                                        <div className="flex">
                                        <div className="flex-1 py-5 pl-5 overflow-hidden">
                                            <p className="" style={{color: 'red', fontSize: '20px'}}>Address information errors!!!!!</p>
                                        </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div style={{width:'50%'}}>
                    <div className="mt-5 bg-white rounded-lg shadow">
                        <h2 className='mx-5'>Product</h2>
                        {
                            products.flatMap( product => 
                            (<div className='mx-2 bg-white rounded-lg shadow'>
                            <div className='flex col-span-2 mx-2 bg-white rounded-lg'>
                                <div className="mt-2 bg-white rounded-lg" 
                                    style={{maxWidth: '70%'}}>
                                    <p className='mx-4 h6 !leading-[1.4] line-clamp-3'>{product.product_name}</p>
                                </div>
                                <div className="img-wrapper justify-center" 
                                style={{width: '100px', height:'100px', margin: 'auto', overflow: 'hidden'}}>
                                        <img src={product.img_link[0]} alt={product.product_name} 
                                        style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                                </div>
                            </div>
                            <RatingStars className="mx-6" rating={product.product_ratingAverage}/>
                            <div className={`mx-6 flex`}>
                                <p className="mr-4 font-heading font-bold leading-[1.4] text-green text-2xl">
                                    {product.product_discounted_price || 0}
                                </p>
                                <p className="font-heading font-bold leading-[1.4] text-accent text-sm line-through">
                                    {product.product_price || 0}
                                </p>
                                <p className='ml-4 underline decoration-sky-500 font-bold'>USD</p>
                            </div>
                             <div className={`mx-6 flex items-center`}>
                                <p className="font-heading font-bold leading-[1.4] text-accent text-sm mr-4">
                                    Quantity : {product.Quantity || 0}
                                </p>
                                <p className="font-heading font-bold leading-[1.4] text-accent text-sm">
                                    Type : {product.Type || 0}
                                </p>
                                {
                                    (product.Discounts[0]) && 
                                    (
                                        <Autocomplete
                                            className='my-8 mx-4 w-64'
                                            disablePortal
                                            id="combo-box-demo"
                                            options={product.Discounts.map(discount => discount.discount_code)}
                                            getOptionLabel={getOptionDiscount}
                                            onChange={(event,newValue)=>{
                                                if(discount.length === 0 && newValue){
                                                    setDiscount([{
                                                        codeId: newValue,
                                                        item_products:  product.product_id
                                                    }])
                                                }
                                                else{
                                                    const isDuplicate = discount.some(item => item.item_products === product.product_id);
                                                    if(newValue && !isDuplicate){
                                                        setDiscount([...discount, {
                                                            codeId: newValue,
                                                            item_products:  product.product_id
                                                        }])
                                                    }else if(newValue){
                                                        const updateDiscount = discount.map(discount => {
                                                            if(discount.item_products === product.product_id){
                                                                return  {
                                                                    codeId: newValue,
                                                                    item_products:  product.product_id
                                                                }
                                                            }
                                                            return discount;
                                                        }) 
                                                        setDiscount(updateDiscount);
                                                    }
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} label="List Discounts" />}
                                            value={"None"}
                                        />
                                    )
                                }
                                
                             </div>
                            
                            <div className={`mx-6 flex font-bold`}>
                                <p className='mr-4'>Total Price : </p>
                                <p className="font-heading font-bold leading-[1.4] text-green text-2xl">
                                    {product.product_discounted_price*product.Quantity || 0}
                                </p>
                                <p className='ml-4 underline decoration-sky-500 font-bold'>USD</p>
                            </div>
                        </div>))
                        }
                        
                    </div>
                    <div className="mt-5 bg-white rounded-lg shadow">
                        <h2 className='mx-5'>Check out</h2>                    
                        <div className={`mx-6 items-center my-4`}>
                            <p className="font-heading font-bold leading-[1.4] text-accent text-sm mr-4 my-2">Total check out : {dataCheckOut.checkout_order.totalCheckout.toFixed(2)} USD</p>
                            <p className="font-heading font-bold leading-[1.4] text-accent text-sm mr-4 my-2">Total discount : {dataCheckOut.checkout_order.totalDiscount.toFixed(2)} USD</p>
                            <p className="font-heading font-bold leading-[1.4] text-accent text-sm mr-4 my-2">Total check out : {dataCheckOut.checkout_order.totalPrice.toFixed(2)} USD</p>
                        </div>
                        <NavLink className="btn btn--outline blue !text-sm my-4" onClick={handleCheckOut}>
                            <i className="icon icon-pen-solid text-xs"/> Check Out Now
                        </NavLink>  
                        <NavLink className="btn btn--outline blue !text-sm my-4" onClick={handlePayment}>
                            <i className="icon icon-pen-solid text-xs"/> Payment NOW
                        </NavLink>
                        <NavLink className="btn btn--outline blue !text-sm my-4" onClick={handleOrder}>
                            <i className="icon icon-pen-solid text-xs"/> Payment after receipt
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
    }else{
        return <Loader />
    }
    
}

export default PaymentPages