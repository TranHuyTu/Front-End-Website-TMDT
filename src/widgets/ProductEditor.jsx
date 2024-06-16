// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import DropFiles from '@components/DropFiles';
import {toast} from 'react-toastify';
import MediaDropPlaceholder from '@ui/MediaDropPlaceholder';

// hooks
import {useForm, Controller} from 'react-hook-form';

// constants
import {
    PRODUCT_CATEGORIES,
} from '@constants/options';

// utils
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';
import SwipeableTextMobileStepper from '@components/SwipeableTextMobileStepper';

const ProductEditor = () => {
    let { productId } = useParams();
    const navigate = useNavigate();
    const productType = PRODUCT_CATEGORIES.filter(category => category.value !== 'All');
    const [defaultValues, setDefaultValues] = useState();
    const [listImages, setListImages] = useState([]);
   
    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    }, [])
    const fetchData = async () => {
        if(productId){
            const result = await axiosClient
                .get(`/product/${productId}`,
                {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                });

            const defaultValue = {
                image1: result.img_link[0] || '',
                image2: result.img_link[1] || '',
                image3: result.img_link[2] || '',
                image4: result.img_link[3] || '',
                productAttributes: '',
                dimensions: '',
                description: result.product_description.split("|")[0],
                productName: result.product_name,
                category: result.product_category,
                productType: result.product_type,
                regularPrice: result.product_price,
                salePrice: result.product_discounted_price,
                variants: '',
                quantityVariants: 0,
            }
            setDefaultValues(defaultValue);
        }else{
            const defaultValue = {
                image1: '',
                image2: '',
                image3: '',
                image4: '',
                productAttributes: '',
                dimensions: '',
                description: "Description",
                productName: "Product name",
                category: "Category",
                productType: "Product type",
                regularPrice: "Regular price",
                salePrice: "Sale price",
                variants: '',
                quantityVariants: 0,
            }
            setDefaultValues(defaultValue);
        }
    }
    const {register, handleSubmit, control, formState: {errors}} = useForm({
        defaultValues: defaultValues,
    });

    // do something with the data
    const handlePublish = async data => {
        let img_link = [];
        if(data.image1.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }
        if(data.image2.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }
        if(data.image3.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }
        if(data.image4.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }

        let product_quantity = [];
        if(data.Variants0 !== "" && data.quantityVariants0 !== "0"){
            product_quantity.push({type: data.Variants0, quantity: parseInt(data.quantityVariants0)});
        }
        if(data.Variants1 !== "" && data.quantityVariants1 !== "0"){
            product_quantity.push({type: data.Variants1, quantity: parseInt(data.quantityVariants1)});
        }
        if(data.Variants2 !== "" && data.quantityVariants2 !== "0"){
            product_quantity.push({type: data.Variants2, quantity: parseInt(data.quantityVariants2)});
        }
        if(data.Variants3 !== "" && data.quantityVariants3 !== "0"){
            product_quantity.push({type: data.Variants3, quantity: parseInt(data.quantityVariants3)});
        }

        let product_description = data.description;
        if(data.productAttributes0 !== "" && data.dimensions0 !== "0"){
            product_description+=`|${data.productAttributes0}: ${data.dimensions0}`;
        }
        if(data.productAttributes1 !== "" && data.dimensions1 !== "0"){
            product_description+=`|${data.productAttributes1}: ${data.dimensions1}`;
        }
        if(data.productAttributes2 !== "" && data.dimensions2 !== "0"){
            product_description+=`|${data.productAttributes2}: ${data.dimensions2}`;
        }
        if(data.productAttributes3 !== "" && data.dimensions3 !== "0"){
            product_description+=`|${data.productAttributes3}: ${data.dimensions3}`;
        }
        if(data.productAttributes4 !== "" && data.dimensions4 !== "0"){
            product_description+=`|${data.productAttributes4}: ${data.dimensions4}`;
        }
        if(data.productAttributes5 !== "" && data.dimensions5 !== "0"){
            product_description+=`|${data.productAttributes5}: ${data.dimensions5}`;
        }
        if(data.productAttributes6 !== "" && data.dimensions6 !== "0"){
            product_description+=`|${data.productAttributes6}: ${data.dimensions6}`;
        }
        if(data.productAttributes7 !== "" && data.dimensions7 !== "0"){
            product_description+=`|${data.productAttributes7}: ${data.dimensions7}`;
        }
        if(data.productAttributes8 !== "" && data.dimensions8 !== "0"){
            product_description+=`|${data.productAttributes8}: ${data.dimensions8}`;
        }
        if(data.productAttributes9 !== "" && data.dimensions9 !== "0"){
            product_description+=`|${data.productAttributes9}: ${data.dimensions9}`;
        }

        const dataResult = {
            product_name: data.productName,
            product_thum: [],
            product_description: product_description,
            product_slug: "",
            product_discounted_price: parseInt(data.salePrice),
            product_price: parseInt(data.regularPrice),
            product_category: data.productCategory,
            product_quantity: product_quantity,
            product_type: data.productType.value,
            product_attributes: {
                manufacturer:"Samsung galaxy A24",
                model: "512 GB",
                color:"Black"
            },
            img_link: img_link,
            product_ratingAverage: 4.2,
            product_variation: []
        }

        console.log(dataResult);
        toast.success('Product published successfully');
    }

    // do something with the data
    const handleSave = async data => {
        let img_link = [];
        if(data.image1.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }
        if(data.image2.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }
        if(data.image3.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }
        if(data.image4.length !== 0){
            const formData = new FormData();
            formData.append('image', data.image1[0]);
            const imgLink = await axiosClient
                .post(`/upload`,formData,
                {
                    headers: { 
                            'Content-Type': 'multipart/form-data',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                });
            img_link.push(imgLink.url);
        }

        let product_quantity = [];
        if(data.Variants0 !== "" && data.quantityVariants0 !== "0"){
            product_quantity.push({type: data.Variants0, quantity: parseInt(data.quantityVariants0)});
        }
        if(data.Variants1 !== "" && data.quantityVariants1 !== "0"){
            product_quantity.push({type: data.Variants1, quantity: parseInt(data.quantityVariants1)});
        }
        if(data.Variants2 !== "" && data.quantityVariants2 !== "0"){
            product_quantity.push({type: data.Variants2, quantity: parseInt(data.quantityVariants2)});
        }
        if(data.Variants3 !== "" && data.quantityVariants3 !== "0"){
            product_quantity.push({type: data.Variants3, quantity: parseInt(data.quantityVariants3)});
        }

        let product_description = data.description;
        if(data.productAttributes0 !== "" && data.dimensions0 !== "0"){
            product_description+=`|${data.productAttributes0}: ${data.dimensions0}`;
        }
        if(data.productAttributes1 !== "" && data.dimensions1 !== "0"){
            product_description+=`|${data.productAttributes1}: ${data.dimensions1}`;
        }
        if(data.productAttributes2 !== "" && data.dimensions2 !== "0"){
            product_description+=`|${data.productAttributes2}: ${data.dimensions2}`;
        }
        if(data.productAttributes3 !== "" && data.dimensions3 !== "0"){
            product_description+=`|${data.productAttributes3}: ${data.dimensions3}`;
        }
        if(data.productAttributes4 !== "" && data.dimensions4 !== "0"){
            product_description+=`|${data.productAttributes4}: ${data.dimensions4}`;
        }
        if(data.productAttributes5 !== "" && data.dimensions5 !== "0"){
            product_description+=`|${data.productAttributes5}: ${data.dimensions5}`;
        }
        if(data.productAttributes6 !== "" && data.dimensions6 !== "0"){
            product_description+=`|${data.productAttributes6}: ${data.dimensions6}`;
        }
        if(data.productAttributes7 !== "" && data.dimensions7 !== "0"){
            product_description+=`|${data.productAttributes7}: ${data.dimensions7}`;
        }
        if(data.productAttributes8 !== "" && data.dimensions8 !== "0"){
            product_description+=`|${data.productAttributes8}: ${data.dimensions8}`;
        }
        if(data.productAttributes9 !== "" && data.dimensions9 !== "0"){
            product_description+=`|${data.productAttributes9}: ${data.dimensions9}`;
        }

        const dataResult = {
            product_name: data.productName,
            product_thum: [],
            product_description: product_description,
            product_slug: "",
            product_discounted_price: parseInt(data.salePrice),
            product_price: parseInt(data.regularPrice),
            product_category: data.productCategory,
            product_quantity: product_quantity,
            product_type: data.productType.value,
            product_attributes: {
                manufacturer:"Samsung galaxy A24",
                model: "512 GB",
                color:"Black"
            },
            img_link: img_link,
            product_ratingAverage: 4.2,
            product_variation: []
        }

        const result = await axiosClient
            .post(`/product`,dataResult,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        
        if(result){
            toast.info('Product saved successfully');
            navigate('/products-draft')
        }
        
    }

    const handleImageChange = (files, label) => {
        const file = files[0];
        let previewUrl;
        if (file) {
            previewUrl = URL.createObjectURL(file);
        }
        const check = listImages.filter(image => image.label === label);
        if(check.length > 0) {
            const arrImage = listImages.map(image => {
                if(image.label === label){
                    return {
                        label: label,
                        imgPath:previewUrl,
                    }
                }else{
                    return image
                }}
            )
            setListImages(arrImage);
        }else{
            setListImages([...listImages, {
                label: label,
                imgPath:previewUrl,
            }])
        }
    };

    if (!defaultValues) return <Loader/>;
    return (
        <Spring className="card flex-1 xl:py-10">
            <h5 className="mb-[15px]">Product Settings</h5>
            <form className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10">
                <div>
                    <div>
                        <span className="block field-label mb-2.5">Product Images</span>
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
                            <Controller name="image1"
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
                                        )}/>
                            <Controller name="image2"
                                        control={control}
                                        defaultValue=""
                                        render={({field}) => (
                                            <DropFiles wrapperClass="media-dropzone 2xl:col-span-2"
                                                        onChange={files => {
                                                            field.onChange(files);
                                                            handleImageChange(files, "image2");
                                                        }}>
                                                <MediaDropPlaceholder/>
                                            </DropFiles>
                                        )}/>
                            <div className="grid grid-cols-2 col-span-2 gap-5 2xl:col-span-1 2xl:grid-cols-1">
                                <Controller name="image3"
                                            control={control}
                                            defaultValue=""
                                            render={({field}) => (
                                                <DropFiles wrapperClass="media-dropzone"
                                                        onChange={files => {
                                                            field.onChange(files);
                                                            handleImageChange(files, "image3");
                                                        }}>
                                                    <MediaDropPlaceholder/>
                                                </DropFiles>
                                            )}/>
                                <Controller name="image4"
                                            control={control}
                                            defaultValue=""
                                            render={({field}) => (
                                                <DropFiles wrapperClass="media-dropzone"
                                                        onChange={files => {
                                                            field.onChange(files);
                                                            handleImageChange(files, "image4");
                                                        }}>
                                                    <MediaDropPlaceholder/>
                                                </DropFiles>
                                            )}/>
                            </div>
                        </div>
                        <div>
                            {listImages.length !== 0 && <SwipeableTextMobileStepper images={listImages}/>}
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="description">Description</label>
                            <textarea
                                className={classNames(`field-input !h-[160px] !py-[15px] !overflow-y-auto`, {'field-input--error': errors.description})}
                                id="description"
                                defaultValue={defaultValues.description}
                                {...register('description', {required: true})}/>
                        </div>
                        {Array.from({ length: 10 }, (_, index) => (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,205px)]">       
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor={`productAttributes${index}`}>Attributes</label>
                                    <input className={classNames('field-input')}
                                        id={`productAttributes${index}`}
                                        defaultValue={defaultValues.productAttributes}
                                        placeholder="Product Attributes"
                                        {...register(`productAttributes${index}`)}/>
                                </div>
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor={`dimensions${index}`}>Attributes Detail</label>
                                    <input className={classNames('field-input', {'field-input--error': errors.dimensions})}
                                        id={`dimensions${index}`}
                                        defaultValue={defaultValues.dimensions}
                                        placeholder="Product dimensions"
                                        {...register(`dimensions${index}`)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-4 gap-x-2">
                    <div className="field-wrapper">
                        <label className="field-label" htmlFor="productName">
                            Product Name
                        </label>
                        <input
                            className={classNames('field-input', {'field-input--error': errors.productName})}
                            id="productName"
                            defaultValue={defaultValues.productName}
                            placeholder="Enter product name"
                            {...register('productName', {required: true})}/>
                    </div>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="productCategory">
                                Category
                            </label>
                            <input className={classNames('field-input')}
                                       id="productCategory"
                                       defaultValue={defaultValues.category}
                                       placeholder="Product Category"
                                       {...register('productCategory', {required: true})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="productType">
                                Product Type
                            </label>
                            <Controller name="productType"
                                        control={control}
                                        defaultValue={defaultValues.productType}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Select isInvalid={errors.productType}
                                                    id="productType"
                                                    placeholder="Select category"
                                                    options={productType}
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}/>
                                        )}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="regularPrice">
                                Regular Price
                            </label>
                            <input
                                className={classNames('field-input', {'field-input--error': errors.regularPrice})}
                                id="regularPrice"
                                defaultValue={defaultValues.regularPrice}
                                placeholder="$99.99"
                                {...register('regularPrice', {required: true, pattern: /^[0-9]*$/})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="salePrice">
                                Sale Price
                            </label>
                            <input
                                className={classNames('field-input', {'field-input--error': errors.salePrice})}
                                id="salePrice"
                                defaultValue={defaultValues.salePrice}
                                placeholder="$99.99"
                                {...register('salePrice', {required: true, pattern: /^[0-9]*$/})}/>
                        </div>
                    </div>            
                    {/* <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-3">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="stockStatus">
                                Stock Status
                            </label>
                            <Controller name="stockStatus"
                                        control={control}
                                        defaultValue={defaultValues.stockStatus}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Select isInvalid={errors.stockStatus}
                                                    id="stockStatus"
                                                    placeholder="Select stock status"
                                                    options={STOCK_STATUS_OPTIONS}
                                                    onChange={(value) => {
                                                        field.onChange(value)
                                                    }}
                                                    value={field.value}/>
                                        )}/>
                        </div>
                        <div className="field-wrapper">
                                <label className="field-label" htmlFor="qty">
                                    Quantity in Stock
                                </label>
                                <input
                                    className={classNames('field-input', {'field-input--error': errors.qty})}
                                    id="qty"
                                    placeholder="0"
                                    defaultValue={defaultValues.qty}
                                    {...register('qty', {required: true, pattern: /^[0-9]*$/})}/>
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="address">
                                    Address
                                </label>
                                <input
                                    className={classNames('field-input')}
                                    id="address"
                                    placeholder={defaultValues.address}
                                    defaultValue={defaultValues.address}
                                    {...register('address', {required: true})}/>
                            </div>
                    </div> */}
                    {Array.from({ length: 4 }, (_, index) => (
                        <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor={`Variants${index}`}>
                                    Variants
                                </label>
                                <input
                                    className={classNames('field-input')}
                                    id={`Variants${index}`}
                                    defaultValue={defaultValues.variants}
                                    placeholder="Red of Green of Blue"
                                    {...register(`Variants${index}`)}/>
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor={`quantityVariants${index}`}>
                                    Quantity variants
                                </label>
                                <input
                                    className={classNames('field-input')}
                                    id={`quantityVariants${index}`}
                                    defaultValue={defaultValues.quantityVariants}
                                    placeholder="0"
                                    {...register(`quantityVariants${index}`)}/>
                            </div>
                        </div>
                    ))}
                    <div className="grid gap-2 mt-5 sm:grid-cols-2 sm:mt-10 md:mt-11">
                        <button className="btn btn--secondary" onClick={handleSubmit(handleSave)}>
                            Save to Drafts
                        </button>
                        <button className="btn btn--primary" onClick={handleSubmit(handlePublish)}>
                            Publish Product
                        </button>
                    </div>
                </div>
            </form>
        </Spring>
    )
}

export default ProductEditor