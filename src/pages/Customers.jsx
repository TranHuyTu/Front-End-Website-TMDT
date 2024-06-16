// components
import PageHeader from '@layout/PageHeader';
import CustomerRetentionRate from '@widgets/CustomerRetentionRate';
import DemographicSegmentation from '@widgets/DemographicSegmentation';
import ConversionRate from '@widgets/ConversionRate';
import CustomersInfobox from '@components/CustomersInfobox';

const Customers = () => {
    return (
        <>
            <PageHeader title="Customers"/>
            <div className="widgets-grid grid-cols-1 xl:grid-cols-6">
                <div className="widgets-grid grid-cols-1 md:grid-cols-3 xl:col-span-3">
                    <CustomersInfobox count={1287} color="green"/>
                    <CustomersInfobox label="New" count={153} iconClass="user-plus-solid"/>
                    <CustomersInfobox label="Regular" count={87} color="red" iconClass="user-group-crown-solid"/>
                </div>
                <ConversionRate/>
                <CustomerRetentionRate/>
                <DemographicSegmentation/>
            </div>
            {/* <div className="widgets-grid grid-cols-1 xl:grid-cols-2 mt-8">
                <div>
                    <div className='widgets-grid grid-cols-1 xl:grid-cols-2 relative'>
                        <h3 className="min-w-max">TOP VIP</h3>
                        <img className='absolute w-20 top-0 right-2' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718189697/IMAGE_SHOP/th_uelq2t.jpg" alt="img_top_vip" />
                    </div>
                    <div>
                        <div className='relative' style={{
                            height: '140px'
                        }}>
                            <div className='absolute bottom-2' style={{
                                left: '36%',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid yellow',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                right: '0',
                                bottom: '-88px',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid green',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                bottom: '-60px',
                                left: '0',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid red',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                        </div>
                        
                        <img className='' src='https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192688/IMAGE_SHOP/th_1_sp5nje.jpg' alt=''></img>
                    </div>
                </div>
                <div>
                    <div className='widgets-grid grid-cols-1 xl:grid-cols-2 relative'>
                        <h3 className="min-w-max">Purchasing trends</h3>
                        <img className='absolute w-20 top-0 right-2' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718189697/IMAGE_SHOP/th_uelq2t.jpg" alt="img_top_vip" />
                    </div>
                    <div>
                        <div className='relative' style={{
                            height: '140px'
                        }}>
                            <div className='absolute bottom-2' style={{
                                left: '36%',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid yellow',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                right: '0',
                                bottom: '-88px',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid green',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                bottom: '-60px',
                                left: '0',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid red',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                        </div>
                        <img className='' src='https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192688/IMAGE_SHOP/th_1_sp5nje.jpg' alt=''></img>
                    </div>
                </div>
            </div>
            <div className="widgets-grid grid-cols-1 xl:grid-cols-2 mt-8">
                <div>
                    <div className='widgets-grid grid-cols-1 xl:grid-cols-2 relative'>
                        <h3 className="min-w-max">Potential customers of the store</h3>
                        <img className='absolute w-20 top-0 right-2' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718189697/IMAGE_SHOP/th_uelq2t.jpg" alt="img_top_vip" />
                    </div>
                    <div>
                        <div className='relative' style={{
                            height: '140px'
                        }}>
                            <div className='absolute bottom-2' style={{
                                left: '36%',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid yellow',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                right: '0',
                                bottom: '-88px',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid green',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                bottom: '-60px',
                                left: '0',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid red',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                        </div>
                        
                        <img className='' src='https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192688/IMAGE_SHOP/th_1_sp5nje.jpg' alt=''></img>
                    </div>
                </div>
                <div>
                    <div className='widgets-grid grid-cols-1 xl:grid-cols-2 relative'>
                        <h3 className="min-w-max">Active store customers</h3>
                        <img className='absolute w-20 top-0 right-2' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718189697/IMAGE_SHOP/th_uelq2t.jpg" alt="img_top_vip" />
                    </div>
                    <div>
                        <div className='relative' style={{
                            height: '140px'
                        }}>
                            <div className='absolute bottom-2' style={{
                                left: '36%',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid yellow',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                right: '0',
                                bottom: '-88px',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid green',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                            <div className='absolute' style={{
                                bottom: '-60px',
                                left: '0',
                                width: '200px',
                                height: '140px'
                            }}>
                                <img className ='rounded-full' src="https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192939/IMAGE_SHOP/IMG_20230730_220122_foavjb.jpg" alt='' 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid red',
                                    margin: 'auto',
                                }}/>
                                <p className='text-center font-bold text-2xl'>THTD</p>
                                <p className=''>tranhuytu37@gmail.com</p>
                            </div>
                        </div>
                        
                        <img className='' src='https://res.cloudinary.com/dbaul3mwo/image/upload/v1718192688/IMAGE_SHOP/th_1_sp5nje.jpg' alt=''></img>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Customers