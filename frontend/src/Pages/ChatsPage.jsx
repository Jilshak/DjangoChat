import axios from 'axios'
import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
function ChatsPage() {

    const navigate = useNavigate()

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [nextPerson, setNextPerson] = useState('');
    const [room_id, setRoomId] = useState('');
    const [socket, setSocket] = useState(null);


    //get username on the nav for the selected user for chat
    const [getUser, setGetUser] = useState('')

    const getUsername = async () => {
        let user_data = await users.find((item) => item.id == nextPerson)
        await setGetUser(user_data?.username)
    }

    const token = localStorage.getItem('authToken');
    const decoded = jwtDecode(token);

    // Function to save messages to local storage
    const saveMessagesToLocalStorage = (roomId, messages) => {
        localStorage.setItem(roomId, JSON.stringify(messages));
    };

    // Function to load messages from local storage
    const loadMessagesFromLocalStorage = (roomId) => {
        const storedMessages = localStorage.getItem(roomId);
        return storedMessages ? JSON.parse(storedMessages) : [];
    };

    //logout function
    const logout = async () => {
        console.log("clicked logout")
        await localStorage.removeItem('authToken')
        navigate('/login')
    }

    useEffect(() => {
        if (socket) {
            const storedMessages = loadMessagesFromLocalStorage(room_id);

            // Set messages from local storage without triggering useEffect
            setMessages(storedMessages);
            console.log("This is the stored message: ", storedMessages);

            socket.onmessage = async (event) => {
                const message = await JSON.parse(event.data);
                console.log("This is the message: ", message)

                // Update messages in state and save to local storage
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, message];
                    saveMessagesToLocalStorage(room_id, updatedMessages);
                    return updatedMessages;
                });
            };
        }
    }, [room_id, socket]);


    const handleUser = async (next_person) => {
        try {
            setMessages([])
            let user_id = decoded?.user_id;
            let secondUser_id = next_person;
            let room_id = user_id > secondUser_id ? `${user_id}_${secondUser_id}` : `${secondUser_id}_${user_id}`;
            setNextPerson(next_person);
            setRoomId(room_id);
            await getUsername(user_id);
    
            const request = await axios.get(`http://127.0.0.1:8000/chat/`)
            const response = request.data
            if (request.status === 200) {
                let data = response.filter((item) => item.thread_name === `chat_${room_id}`)
                setMessages((prevMessages) => [...prevMessages, ...data]);
                console.log("This is the new messages list: ", data);
            }
    
            // Create a new WebSocket connection if it doesn't exist yet
            if (!socket) {
                const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${room_id}/`);
                setSocket(newSocket);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    


    const handleInputChange = (event) => {
        setMessageInput(event.target.value);
    };

    const handleSendMessage = async () => {
        console.log("The handle submit button is clicked!!!")
        // Check if the socket is open before sending a message
        if (socket) {
            await socket.send(JSON.stringify({ message: messageInput, sender_username: decoded?.username }));
            console.log("The message has been sent: ", messageInput, decoded.username);
            await setMessageInput('');
        } else {
            console.log("WebSocket is not open.");
        }
    };

    const getUsers = async () => {
        try {
            const req = await axios.get(`http://127.0.0.1:8000/users/`);
            const res = req.data;
            if (req.status === 200) {
                console.log("The users list has been fetched!!!: ", res);
                setUsers(res);
            } else {
                console.log("Something went wrong while fetching the user data");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.onclose = (event) => {
                console.log("WebSocket closed:", event.reason);
                // You can handle reconnection logic here if necessary
                console.log("The socket is closed")
            };
        }
    }, [socket]);

    return (
        <div>
            <div className="container mx-auto shadow-lg rounded-lg">
                <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
                    <div className="font-semibold flex justify-evenly text-2xl">
                        <p>ChatApp</p>
                        <button onClick={logout} className='text-red-400 text-[20px] flex items-center relative lg:left-[250px]'>
                            Logout
                        </button>
                    </div>
                    <div className="w-1/2">
                        <input
                            type="text"
                            name=""
                            id=""
                            placeholder="search IRL"
                            className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                        />
                    </div>
                    <div
                        className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
                    >
                        <p>
                            {decoded.username}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row justify-between bg-white">
                    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                        <div className="border-b-2 py-4 px-2">
                            <input
                                type="text"
                                placeholder="search chatting"
                                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                        </div>
                        <div className='border-gray-200 w-full'>
                            <p>
                                {getUser ? getUser : null}
                            </p>
                        </div>
                        {
                            users ?
                                <>
                                    {
                                        users?.map((item) => {
                                            if (item.id !== decoded.user_id) {
                                                return (
                                                    <div
                                                        onClick={(e) => {
                                                            handleUser(item.id);
                                                            console.log("Its being clicked", item.id);
                                                        }}
                                                        key={item.id}
                                                        className="flex cursor-pointer flex-row py-4 px-2 items-center border-b-2"
                                                    >
                                                        <div className="w-1/4">
                                                            <img
                                                                src="https://source.unsplash.com/otT2199XwI8/600x600"
                                                                className="object-cover h-12 w-12 rounded-full"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <div className="text-lg font-semibold">{item.username}</div>
                                                            <span className="text-gray-500">Hi {item.username}, Welcome</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </>
                                : null
                        }
                    </div>
                    <div className="w-full h-[88vh] px-5 flex flex-col justify-between">
                        <div className="flex flex-col mt-5 overflow-x-auto">
                            {
                                messages?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`flex ${item.sender === decoded?.user_id ? 'justify-end' : 'justify-start'} mb-4`}
                                        >
                                            <div
                                                className={`py-3 px-4 ${item.sender === decoded?.user_id ? 'bg-gray-300 rounded-br-3xl rounded-tr-3xl rounded-tl-xl': 'bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white' }`}
                                            >
                                                {item.message}
                                            </div>
                                            <img
                                                src={`https://source.unsplash.com/vpOeXr5wmR4/600x600`}
                                                className="object-cover h-8 w-8 rounded-full"
                                                alt=""
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="py-5 flex relative">
                            <input
                                onChange={handleInputChange}
                                className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                                type="text"
                                placeholder="type your message here..."
                                value={messageInput}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 me-0 absolute right-0 py-5 rounded-e-lg"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatsPage;
