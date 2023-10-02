import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import style from './ChatList.module.css';

import { AuthContext } from "../../../Context/AuthContext";
import ChatItem from './ChatItem';
 
const ChatList = (props) => {
    const auth = useContext(AuthContext);
    let [users, setUsers] = useState([]);

    // getting all chat rooms 
    useEffect(() => {
        axios.get('http://localhost:8000/Chat/UsersList')
        .then(data => {
            let users = data.data.users;
            users = users.filter(user => user._id !== auth.user._id); // remove Auth user from he list
            
            setUsers([...users])
            console.log(users)
        })
        .catch(err => console.log(err))
    }, [props.DBroomData, props.newRoomCreation, props.newUserCreation]); 
    // when a chat from users list is clicked, the list should update its data from
    // the database so the created room (onclick) appears in that user (rooms) array
    // so the chatitem component of that specific user can use the (room._id)
    // for (useEffect) inner conditions 

    // change (Rerendering) other users status when thay take actions (login - logout) | Socket.io
    useEffect(() => {
        let updatedUsers = [...users]
        updatedUsers.forEach(user => {
            if(user._id === props.otherUserStatus.userID)
            user.status = props.otherUserStatus.status;
        })
        setUsers(updatedUsers)
    }, [props.otherUserStatus])

    const searchHandler = (event) => {
        let value = event.target.value;
        let isVisible = false;
        let updatedUsers = [...users]
        updatedUsers.forEach(user => {
            isVisible = user.name.toLowerCase().includes(value) || user.name.toUpperCase().includes(value) ? true : false;
            user.searchVisibility = isVisible;
        })
        setUsers(updatedUsers)
    }

    const clickHandler = (userID) => {
        // getting data of a specific room onClick
        axios.get(`http://localhost:8000/Chat/Rooms/${userID}/${auth.user._id}`)
        .then(data => {
            props.fetchRoomData({...data.data});
            console.log(data.data)
        })
        .catch(err => console.log(err))

        // activate sideDrawer (close event) onClick when screen width in mobile mood
        if( (window.innerWidth || document.documentElement.clientWidth) <= 900){
            props.toggleHandler();
        }
    }

    const notificationHandler = (action, userID) => {
        let updatedUsers = [...users];

        updatedUsers.forEach(user => {
            // console.log(user.notifications)
            if(user._id === userID && action === 'reset') // when accessing the room
            user.notifications = user.notifications.filter(notify => notify.userID !== userID)
            else if(user._id === userID.creatorID && action === 'inc') // when message recieved
            user.notifications.push({to: userID.to, from: userID.creatorID});
        })

        setUsers(updatedUsers);
    }

    return (
        <div className={style.Container}>
            <div className={style.ListHeader}>
                <div className={style.search}><input type="text" placeholder="Search" onInput={(e) => searchHandler(e)}/></div>
                <div className={style.title}>Chats</div>
            </div>
            <div className={style.ChatList}>
                {
                users?.map((user, index) => {
                    return <ChatItem
                    key={index}
                    user={user}
                    DBroomData={props.DBroomData}
                    recievedMessage={props.recievedMessage}
                    authUserMessage={props.authUserMessage}
                    otherUserTyping={props.otherUserTyping}
                    notificationHandler={notificationHandler}
                    onClick={() => clickHandler(user._id)}/>
                })
                }
            </div>
        </div>
        
    )
}
 
export default ChatList;