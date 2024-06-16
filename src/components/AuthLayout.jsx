// components
import Logo from '@components/Logo';
import {LoginSocialGoogle, LoginSocialFacebook} from 'reactjs-social-login';
import {toast} from 'react-toastify';
import Spring from '@components/Spring';
import PasswordInput from '@components/PasswordInput';

// hooks
import {useForm, Controller} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {useWindowSize} from 'react-use';

// utils
import classNames from 'classnames';

// assets
import media from '@assets/login.webp';
import google from '@assets/icons/google.png';
import facebook from '@assets/icons/facebook.png';
import axiosClient from '@api/axiosClient';
import { useState } from 'react';
import axios from 'axios';

const AuthLayout = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('login');

    const {width} = useWindowSize();
    const navigate = useNavigate();
    const {register, formState: {errors}, control} = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async(event) => {
        event.preventDefault();
        if(status === 'login'){
            let result;
            try {
                result = await axiosClient
                .post('user/login', 
                {email, password} ,
                {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                });
            } catch (error) {
                const element = await document.querySelector('.warning');
                const element_content = await document.querySelector('.warning-content');
                element_content.textContent = 'Account or password is incorrect';
                element.style.display = 'block'; 
            }
            await sessionStorage.setItem('x-client-id', JSON.stringify(result.metadata.user._id)); 
            await sessionStorage.setItem('x-rtoken-id', JSON.stringify(result.metadata.tokens.refreshToken)); 
            const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            console.log(roleUser.roleName);
            if(roleUser.roleName === 'user'){
                navigate('/top-products');
            }else if(roleUser.roleName === "shop"){
                await axios.post('http://localhost:9000/v1/api/userOrder',{shopId: result.metadata.user._id},
                {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                })
                navigate('/');
            }else if(roleUser.roleName === 'admin'){
                navigate('/');
            }
        }
        else{
            const result = await axiosClient
            .post(`user/welcome_back?token=${token}`,
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
            await sessionStorage.setItem('x-client-id', JSON.stringify(result.metadata.user._id)); 
            await sessionStorage.setItem('x-rtoken-id', JSON.stringify(result.metadata.tokens.refreshToken)); 
            navigate('/');
        }
        // try {
        //     if(status === 'login'){
        //         const result = await axiosClient
        //         .post('user/login', 
        //         {email, password} ,
        //         {
        //             headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //         });

        //         await sessionStorage.setItem('x-client-id', JSON.stringify(result.metadata.user._id)); 

        //         await sessionStorage.setItem('x-rtoken-id', JSON.stringify(result.metadata.tokens.refreshToken)); 

        //         const roleUser = await axiosClient
        //         .post(`/user/role`,{},
        //         {
        //             headers: { 
        //                 'content-type': 'application/x-www-form-urlencoded',
        //                 'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
        //                 'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
        //             },
        //         });

        //         console.log(roleUser.roleName);

        //         if(roleUser.roleName === 'user'){
        //             navigate('/top-products');
        //         }else if(roleUser.roleName === "shop"){
        //             await axios('http://localhost:9000/v1/api/userOrder',{shopId: result.user._id},
        //             {
        //                 headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //             })
        //             navigate('/');
        //         }else if(roleUser.roleName === 'admin'){
        //             navigate('/');
        //         }
        //     }
        //     else{
        //         const result = await axiosClient
        //         .post(`user/welcome_back?token=${token}`,
        //         {
        //             headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //         });

        //         await sessionStorage.setItem('x-client-id', JSON.stringify(result.metadata.user._id)); 

        //         await sessionStorage.setItem('x-rtoken-id', JSON.stringify(result.metadata.tokens.refreshToken)); 

        //         navigate('/');
        //     }
        // } catch (error) {
        //     const element = await document.querySelector('.warning');
        //     const element_content = await document.querySelector('.warning-content');
        //     element_content.textContent = 'Account or password is incorrect';
        //     element.style.display = 'block'; 
        // }
    }

    const handleSignUp = async() => {
        try {
            const result = await axiosClient
            .post(`user/new_user`,
            {email},
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });

            if(result.token){
                const element = await document.querySelectorAll('.field-wrapper');
                element[1].style.display = 'none';
                element[2].style.display = 'flex';
                setStatus('signup');
            }
        } catch (error) {
            const element = await document.querySelector('.warning');
            const element_content = await document.querySelector('.warning-content');
            element_content.textContent = 'Email already exists';
            element.style.display = 'block';   
        }    
    }

    const onReject = (err) => {
        toast.error(err);
    }

    const handlePasswordReminder = async(event) => {
        event.preventDefault();

        const result = await axiosClient
                .post(`user/forgot_password`,
                {email: email},
                {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                });
        // console.log(result.metadata.token);
        if(result.metadata.token !== 1 ){
            const element = await document.querySelector('.warning');
            const element_content = await document.querySelector('.warning-content');
            element_content.textContent = 'Email already exists';
            element.style.display = 'block'; 
        }else{
            const element = await document.querySelector('.warning');
            const element_content = await document.querySelector('.warning-content');
            element_content.textContent = 'The password has been sent to your email';
            element.style.display = 'block'; 
        }
    }

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 4xl:grid-cols-[minmax(0,_1030px)_minmax(0,_1fr)]">
            {
                width >= 1024 &&
                <div className="flex flex-col justify-center items-center lg:p-[60px]">
                    <Logo imgClass="w-[60px]" textClass="text-[28px]"/>
                    <p className="text-center tracking-[0.2px] font-semibold text-lg leading-6 max-w-[540px] my-7 mx-auto">
                        Gain data-based insights, view progress at a glance, and manage your organization smarter
                    </p>
                    <img className="max-w-[780px]" src={media} alt="media"/>
                </div>
            }
            <div className="bg-widget flex items-center justify-center w-full py-10 px-4 lg:p-[60px]">
                <Spring className="max-w-[460px] w-full" type="slideUp" duration={400} delay={300}>
                    <div className="flex flex-col gap-2.5 text-center">
                        <h1>Welcome back!</h1>
                        <p className="lg:max-w-[300px] m-auto 4xl:max-w-[unset]">
                            Welcome to our system, please log in now to use.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5 warning" style={{display: 'none', border: '1px solid red'}}>
                        <h5 className='warning-heading' style={{color:'red', textAlign: 'center'}}>Warning!!!</h5>
                        <p className='warning-content' style={{color:'red', textAlign: 'center'}}></p>
                    </div>
                    <form className="mt-5">
                        <div className="flex flex-col gap-5">
                            <div className="field-wrapper">
                                <label htmlFor="email" className="field-label">E-mail</label>
                                <input className={classNames('field-input')}
                                       id="email"
                                       type="text"
                                       placeholder="Your E-mail address"
                                       {...register('email', {required: true, pattern: /^\S+@\S+$/i})}
                                       onChange={(e)=>{
                                        setEmail(e.target.value);
                                       }}/>
                            </div>
                            <Controller name="password"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <PasswordInput id="password"
                                                placeholder="Your password"
                                                error={errors.password}
                                                innerRef={field.ref}
                                                isInvalid={errors.password}
                                                value={field.value}
                                                onChange={(e)=>{
                                                 field.onChange(e);
                                                 setPassword(e.target.value);
                                            }}/>
                                        )}/>
                            <div className="field-wrapper" style={{ display: 'none' }} >
                                <label htmlFor="token" className="field-label">Please check your email to receive tokens from us</label>
                                <input className={classNames('field-input')}
                                       id="token"
                                       type="text"
                                       placeholder="Please enter your token received from email"
                                       onChange={(e)=>{
                                        setToken(e.target.value);
                                       }}/>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-6 mt-4 mb-10">
                            <button className="text-btn" onClick={handlePasswordReminder}>
                                Forgot Password?
                            </button>
                            <button className="btn btn--primary w-full" onClick={onSubmit}>Log In</button>
                        </div>
                    </form>
                    <div>
                        <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-border"/>
                            <span className="flex items-center justify-center relative z-10 w-11 h-[23px] m-auto bg-widget">
                                or
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 2xs:grid-cols-2 xs:gap-[30px] mt-[30px] mb-9">
                            <LoginSocialGoogle className="btn btn--social"
                                               client_id={import.meta.env.VITE_GOOGLE_APP_ID}
                                               onReject={onReject}
                                               onResolve={onSubmit}>
                                <img className="icon" src={google} alt="Google"/>
                                Google
                            </LoginSocialGoogle>
                            <LoginSocialFacebook className="btn btn--social"
                                                 appId={import.meta.env.VITE_FB_APP_ID}
                                                 onReject={onReject}
                                                 onResolve={onSubmit}>
                                <img className="icon" src={facebook} alt="Facebook"/>
                                Facebook
                            </LoginSocialFacebook>
                        </div>
                        <div className="flex justify-center gap-2.5 leading-none">
                            <p>Don’t have an account?</p>
                            <button className="text-btn" onClick={handleSignUp}>Sign Up</button>
                        </div>
                    </div>
                </Spring>
            </div>
        </div>
    )
}

export default AuthLayout