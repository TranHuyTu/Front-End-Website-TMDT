// components
import Spring from '@components/Spring';
import LabeledProgressBar from '@components/LabeledProgressBar';

// utils
import {commaFormatter, getPercentage} from '@utils/helpers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@components/Loader';

const DemographicSegmentation = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async()=>{
        const data  = await axios.post('http://localhost:8000/findCountAge/', {}, {
            headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                    },
        })
        setData(data.data.metadata);
    }

    if(data.length === 0){
        return (<Loader />)
    }else{
        return (
            <Spring className="card flex flex-col gap-10 xl:col-span-2">
                <div className="flex flex-col gap-6">
                    <h5 className="max-w-[250px] xs:max-w-[unset]">
                        Demographic segmentation by Age
                    </h5>
                    <div className="flex flex-col gap-5">
                        {
                            data.map((item, index) => (
                                <LabeledProgressBar key={index}
                                                    label={item.label}
                                                    value={getPercentage(data, item.value)}
                                                    displayValue={commaFormatter(item.value)}
                                                    color="header"/>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h5 className="max-w-[250px] xs:max-w-[unset]">
                        Segmentation by Gender
                    </h5>
                    <div>
                        <div className="flex gap-7 mb-2.5 md:gap-14">
                            <div className="flex flex-col gap-3">
                                <div className="badge-icon badge-icon--sm bg-accent">
                                    <i className="icon-venus-regular text-lg"/>
                                </div>
                                <span className="h5">65%</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="badge-icon badge-icon--sm bg-accent">
                                    <i className="icon-mars-regular text-lg"/>
                                </div>
                                <span className="h5">32%</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="badge-icon badge-icon--sm bg-accent">
                                    <i className="icon-genderless-regular text-lg"/>
                                </div>
                                <span className="h5">3%</span>
                            </div>
                        </div>
                        <p className="text-sm max-w-[400px]">
                            Nullam sodales rutrum arcu. Maecenas sed lorem ut dolor tincidunt mattis
                        </p>
                    </div>
                </div>
            </Spring>
        )
    }
}

export default DemographicSegmentation