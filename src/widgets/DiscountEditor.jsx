// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import DropFiles from '@components/DropFiles';
import {toast} from 'react-toastify';
import MediaDropPlaceholder from '@ui/MediaDropPlaceholder';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions } from '@mui/material';

// hooks
import {useForm, Controller} from 'react-hook-form';


// utils
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { Button } from 'antd';
import Search from '@ui/Search';

const DiscountEditor = () => {
    let { code } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [listProducts, setListProducts] = useState([]);
    const [image, setImage] = useState();
   
    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    }, [])

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const fetchData = async () => {
        if(code){
            const defaultValue = {
                name: "Discount 6/6",
                discount_image:"image.img",
                description: "description",
                type: "percentage",
                value: 30,
                max_value: 1000,
                code: code,
                start_date: getCurrentDateTime(),
                end_date: getCurrentDateTime(),
                max_uses: 1,
                uses_count: 0,
                users_used: [],
                discount_users_apply:[],
                max_uses_per_user: 0,
                min_order_value: 200,
                is_active: true,
                applies_to: "specific",
                product_ids: []
            }
            setDefaultValues(defaultValue);
        }else{
            const defaultValue = {
                name: "Discount 6/6",
                discount_image:"image.img",
                description: "description",
                type: "percentage",
                value: 30,
                max_value: 1000,
                code: "SHOP",
                start_date: getCurrentDateTime(),
                end_date: getCurrentDateTime(),
                max_uses: 1,
                uses_count: 0,
                users_used: [],
                discount_users_apply:[],
                max_uses_per_user: 0,
                min_order_value: 200,
                is_active: true,
                applies_to: "specific",
                product_ids: []
            }
            setDefaultValues(defaultValue);
        }
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
    const {register, handleSubmit, control, formState: {errors}} = useForm({
        defaultValues: defaultValues,
    });

    const convertDateTime = (originalDateTime) => {
        const date = new Date(originalDateTime);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = "00"; 

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    }

    // do something with the data
    const handlePublish = async(data) => {
        let img_link = "";
        if(data.discount_image.length !== 0){
            const formData = new FormData();
            formData.append('image', data.discount_image[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link = imgLink.url;
        }
        data.discount_image = img_link
        data.end_date = convertDateTime(data.end_date);
        data.start_date = convertDateTime(data.start_date);
        data.product_ids = listProducts;
        data.max_value = parseInt(data.max_value);
        data.value = parseInt(data.value);
        data.min_order_value = parseInt(data.min_order_value);
        data.max_uses = 1;
        data.uses_count = 0;
        data.users_used = [];
        data.discount_users_apply = [];
        data.max_uses_per_user = 10;
        data.is_active = true;
        data.type = data.type.value;
        data.applies_to = data.applies_to.value;

        const discountNew = await axiosClient
            .post('/discount', data,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                },
            });
        if(discountNew){
            toast.success('Discount published successfully');
            navigate('/discounts-management')
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

    const handleImageChange = (files, label) => {
        const file = files[0];
        let previewUrl;
        if (file) {
            previewUrl = URL.createObjectURL(file);
        }
        setImage(previewUrl);
    };

    if (!defaultValues && products.length === 0) return <Loader/>;
    return (
        <Spring className="card flex-1 xl:py-10">
            <h5 className="mb-[15px]">Product Settings</h5>
            <form className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10">
                <div>
                    <div>
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
                            <div className="flex flex-col gap-4 col-start-1 col-end-2">
                                <span className="block field-label mb-2.5">Product Images</span>
                                <Controller name="discount_image"
                                            control={control}
                                            defaultValue=""
                                            render={({field}) => (
                                                <DropFiles wrapperClass="media-dropzone 2xl:col-span-2"
                                                        onChange={files => {
                                                                field.onChange(files);
                                                                handleImageChange(files,"image1");
                                                            }}>
                                                    <MediaDropPlaceholder/>
                                                </DropFiles>
                                            )}
                                            />
                            </div>
                            <div className="flex flex-col gap-4 col-start-2 col-span-4">
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="description">Description</label>
                                    <textarea
                                        className={classNames(`field-input !h-[160px] !py-[15px] !overflow-y-auto`, {'field-input--error': errors.description})}
                                        id="description"
                                        defaultValue={defaultValues.description}
                                        {...register('description', {required: true})}/>
                                </div>
                            </div>
                        </div>
                        <div><img src={image} alt={image} /></div>
                        <Search wrapperClass="lg:w-[326px]" placeholder="Search Product"/>
                        <div className='flex flex-nowrap overflow-auto' style={{height: '500px'}} onScroll={handleScroll}>
                            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 mt-8 w-full h-full">
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
                                                onClick={()=>{
                                                    const element = document.getElementById(product._id);
                                                    setListProducts([...listProducts, product._id]);
                                                    element.style.display = 'block';
                                                }}>
                                                    Learn More
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
                        
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-4 gap-x-2">
                    <div className="field-wrapper">
                        <label className="field-label" htmlFor="name">
                            Discount Name
                        </label>
                        <input
                            className={classNames('field-input', {'field-input--error': errors.name})}
                            id="name"
                            defaultValue={defaultValues.name}
                            placeholder="Enter product name"
                            {...register('name', {required: true})}/>
                    </div>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="code">
                                code
                            </label>
                            <input className={classNames('field-input')}
                                       id="code"
                                       defaultValue={defaultValues.code}
                                       placeholder="Code"
                                       {...register('code', {required: true})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="type">
                                Discount Type
                            </label>
                            <Controller name="type"
                                        control={control}
                                        defaultValue={defaultValues.type}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Select isInvalid={errors.type}
                                                    id="type"
                                                    placeholder="Select category"
                                                    options={[{ value: 'fixed_amount', label: 'fixed amount' },{ value: 'percentage', label: 'percentage' }]}
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}/>
                                            )}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-3 sm:grid-cols-3">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="max_value">
                                Max order value
                            </label>
                            <input
                                className={classNames('field-input', {'field-input--error': errors.max_value})}
                                id="max_value"
                                defaultValue={defaultValues.max_value}
                                placeholder="$100"
                                {...register('max_value', {required: true, pattern: /^[0-9]*$/})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="min_order_value">
                                Min order value
                            </label>
                            <input
                                className={classNames('field-input', {'field-input--error': errors.min_order_value})}
                                id="min_order_value"
                                defaultValue={defaultValues.min_order_value}
                                placeholder="$0"
                                {...register('min_order_value', {required: true, pattern: /^[0-9]*$/})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="max_uses_per_user">
                                Discount count
                            </label>
                            <input
                                className={classNames('field-input', {'field-input--error': errors.max_uses_per_user})}
                                id="max_uses_per_user"
                                defaultValue={defaultValues.max_uses_per_user}
                                placeholder="100"
                                {...register('max_uses_per_user', {required: true, pattern: /^[0-9]*$/})}/>
                        </div>
                    </div>            
                    <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="value">
                                Value
                            </label>
                             <input
                                className={classNames('field-input', {'field-input--error': errors.value})}
                                id="value"
                                defaultValue={defaultValues.value}
                                placeholder="$0"
                                {...register('value', {required: true, pattern: /^[0-9]*$/})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="applies_to">
                                Max order value
                            </label>
                            <Controller name="applies_to"
                                        control={control}
                                        defaultValue={defaultValues.applies_to}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Select isInvalid={errors.applies_to}
                                                    id="applies_to"
                                                    placeholder="Select category"
                                                    options={[{ value: 'all', label: 'all' },{ value: 'specific', label: 'specific' }]}
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}/>
                                            )}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="start_date">
                                Start date
                            </label>
                            <input
                                className={classNames('field-input', {'field-input--error': errors.start_date})}
                                id="start_date"
                                type='datetime-local'
                                placeholder={defaultValues.start_date}
                                defaultValue={defaultValues.start_date}
                                {...register('start_date', {required: true})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="end_date">
                                End date
                            </label>
                            <input
                                className={classNames('field-input')}
                                id="end_date"
                                type='datetime-local'
                                placeholder={defaultValues.end_date}
                                defaultValue={defaultValues.end_date}
                                {...register('end_date', {required: true})}/>
                        </div>
                    </div> 
                    <div className="grid gap-2 mt-5 sm:grid-cols-2 sm:mt-10 md:mt-11">
                        <button className="btn btn--primary" onClick={handleSubmit(handlePublish)}>
                            Publish Discount
                        </button>
                    </div>
                </div>
            </form>
        </Spring>
    )
}

export default DiscountEditor