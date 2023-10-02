import React, { useContext, useEffect, useState } from "react";
import style from './ChatItem.module.css';

import { AuthContext } from "../../../Context/AuthContext";

const ChatItem = (props) => {
    const auth = useContext(AuthContext);
    let [room, setRoom] = useState([]);
    let [lastMessage, setLastMessage] = useState('');
    let [typingEffect, setTypingEffct] = useState(false);

    const lastMessageViewHandler = (text, to) => {
        let message = 'Joined Recently!';
        if(to === auth.user._id && !!text)
        message = `${props.user.name.split(' ')[0]}: ${text}`;
        else if(to !== auth.user._id && !!text)
        message = `You: ${text}`;

        if(message === 'Joined Recently!')
        return message;
        else if((window.innerWidth || document.documentElement.clientWidth) >= 920)
        message = message.slice(0, 18) + '...';
        else if((window.innerWidth || document.documentElement.clientWidth) >= 750)
        message = message.slice(0, 14) + '...';
        else if((window.innerWidth || document.documentElement.clientWidth) >= 600)
        message = message.slice(0, 12) + '...';
        else 
        message = message.slice(0, 10) + '...';
        
        return message;
    }

    const clickActionsHandler = () => {
        // props.notificationHandler('reset', props.user._id);
        props.onClick();
    }

    // change (Rerendering) room lastMessage when a message is recieved | Socket.io
    useEffect(() => {
        // check if the message was sent to (this user) and belong to (this chat room)
        if(props.recievedMessage?.to === auth.user._id && room?._id === props.recievedMessage?.room){
            let lastM = lastMessageViewHandler(props.recievedMessage?.text, props.recievedMessage?.to);
            setLastMessage(lastM);

            // prevent notification when the chatroom of recieved message is already opened
            if(props.DBroomData?.room._id !== props.recievedMessage?.room)
            props.notificationHandler('inc', props.recievedMessage);
        }
    }, [props.recievedMessage])

    // Rendering other user typing effect | Socket.io
    useEffect(() => {
        // check if the effect meant to (this chat room)
        if(props.otherUserTyping?.to === auth.user._id && room?._id === props.otherUserTyping?.room){
            setTypingEffct(true);
            setTimeout(() => {
                setTypingEffct(false);
            }, 2500)
        }
    }, [props.otherUserTyping])

    // change (Rerendering) room lastMessage when a message is made by authUser | Socket.io
    useEffect(() => {
        // check if the message was made by (this user) and belong to (this chat room)
        if(props.authUserMessage?.creatorID === auth.user._id && room?._id === props.authUserMessage?.room){
            let lastM = lastMessageViewHandler(props.authUserMessage?.text, props.authUserMessage?.to);
            setLastMessage(lastM);
        }
    }, [props.authUserMessage])

    // setting (room lastMessage) at fisrt render from database
    useEffect(() => {
        let r = props.user.rooms.find(room => room.creators.toString() === [auth.user._id, props.user._id].toString() || room.creators.toString() === [props.user._id, auth.user._id].toString());
        let lastM = lastMessageViewHandler(r?.lastMessage?.text, r?.lastMessage?.to);
        setRoom(r);
        setLastMessage(lastM);
    }, [props.user])
    // dependant update on the (users) after they've been updated due to (DBroomData) chat clicked
    // so the room_id can be fetched from backend


    // counting notifications of this user
    let notify = props.user.notifications.filter(notify => notify.from === props.user._id && notify.to === auth.user._id);

    const typing = (
        <div className={style.typingEffictSideBar}>typing...</div>
    )

    const message = (
        <div className={notify?.length !== 0 ? style.unCheckedMessage : null}>{lastMessage}</div>
    )

    return (
        <div className={props.user.searchVisibility ? style.ChatItem : `${style.ChatItem} ${style.hide}`} onClick={clickActionsHandler}>
            
            {/* count circle */}
            {notify?.length !== 0 ? <div className={style.counter}>{notify?.length}</div> : null}

            <div className={style.ImageSide}>
                <div>
                    <img src={props.user.imagePath}/>
                    {props.user.status ? <div className={style.Active}></div> : null}
                </div>
            </div>
            <div className={style.InfoSide}>
                <div className={style.Name}>{props.user.name}</div>
                <div className={style.Message}>{typingEffect ? typing : message}</div>
            </div>
        </div>
    )
}

export default ChatItem;