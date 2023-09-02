import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

function LoginPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        localStorage.getItem('authToken') ? navigate('/') : navigate('/login')
    }, [])

    const handleLogin = async () => {

        let credentials = {
            username: username,
            password: password
        }
        try {
            const request = await axios.post(`http://127.0.0.1:8000/token/`, credentials)
            const response = request.data
            if (request.status === 200) {
                console.log("User has been authorized")
                localStorage.setItem('authToken', response.access)
                navigate('/')
            } else {
                console.log("Something went wrong while loggin in with the user credentials")
            }
        } catch (error) {
            console.log("Error: ", error)
        }

    }

    return (
        <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div class="max-w-md mx-auto">
                        <div>
                            <h1 class="text-2xl font-semibold">Login Form with Floating Labels</h1>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div class="relative">
                                    <input onChange={(e) => setUsername(e.target.value)} autocomplete="off" id="username" name="username" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Username" />
                                    <label for="username" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                                </div>
                                <div class="relative">
                                    <input onChange={(e) => setPassword(e.target.value)} autocomplete="off" id="password" name="password" type="password" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                                    <label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <div class="relative">
                                        <button onClick={handleLogin} class="bg-blue-500 text-white rounded-md px-8 py-1 mt-3">Login</button>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <p>Don't have an account? <Link className='text-blue-500' to='/signup'>
                                        Register
                                    </Link> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
