import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faBars } from "@fortawesome/free-solid-svg-icons";
import style from './ChatRoom.module.css';

import Message from './Message';
import { AuthContext } from "../../../Context/AuthContext";
import { socket } from '../../../Socket/Socket-Connect';

const ChatRoom = (props) => {
    const auth = useContext(AuthContext);
    let [newMessage, setNewMessage] = useState('');
    let [User, setUser] = useState({});
    let [Messages, setMessages] = useState([]);
    let [typingCounter, setTypingCounter] = useState(1);
    let [typingEffect, setTypingEffct] = useState(false); 


    // Change (Rerendering) other users chat messages when a message is recieved | Socket.io
    useEffect(() => {
        // check if the message meant to (this chat room)
        if(props.DBroomData.room._id === props.recievedMessage.room){
            let updatedMessages = [...Messages];
            updatedMessages.unshift(props.recievedMessage);
            setMessages(updatedMessages);
            // let a = new Audio('/audio/recieve-message.mp3');
            // a.play()
        }
    }, [props.recievedMessage])

    // Rendering other user typing effect | Socket.io
    useEffect(() => {
        // check if the effect meant to (this chat room)
        if(props.DBroomData.room._id === props.otherUserTyping.room){
            setTypingEffct(true);
            setTimeout(() => {
                setTypingEffct(false);
            }, 2500)
        }
    }, [props.otherUserTyping])

    // Change (Rerendering) other users status when thay take actions (login/logout) | Socket.io
    useEffect(() => {
        let updatedUser = {...User};
        if(updatedUser._id === props.otherUserStatus.userID){
            updatedUser.status = props.otherUserStatus.status;
            setUser(updatedUser)
        }
    }, [props.otherUserStatus])

    // Change (Rerendering) room data from database when selecting a chat room
    useEffect(() => {
        let DBmessages = [...props.DBroomData.room.messages].reverse();
        setMessages(DBmessages)
        setUser({...props.DBroomData.user})
    }, [props.DBroomData])

    const inputChangeHandler = (event) => {
        let inputValue = event.target.value;
        let tc = typingCounter;
        let typing = {
            creatorID: auth.user._id,
            to: User._id,
            room: props.DBroomData.room._id,
        }
        tc = tc % 3;
        tc = tc + 1;
        if(tc === 1)
        socket.emit('send-typingEffect', typing);

        setTypingCounter(tc);
        setNewMessage(inputValue)
    }

    const sendMessageHandler = () => {
        if(newMessage === '') return 
        let time = new Date().toLocaleTimeString();
        let xm = time.split(' ')[1];
        let hours = time.split(' ')[0].split(':')[0];
        let minutes = time.split(' ')[0].split(':')[1];
        let audio = new Audio('/audio/mixkit-long-pop.wav');
        let message = {
            creatorID: auth.user._id,
            to: User._id,
            text: newMessage,
            time: hours + ':' + minutes + ' ' + xm,
            room: props.DBroomData.room._id,
        }
        
        setNewMessage('');
        props.authUserLastMessageHandler(message)
        socket.emit('send-message', message);
        axios.post('http://localhost:8000/Chat/newMessage', message)
        .then(result => {
            let updatedMessages = [...Messages];
            updatedMessages.unshift(message);
            setMessages([...updatedMessages]);
            audio.play();
        })
        .catch(err => console.log(err))
    }

    let placeholder = (
        <div className={style.placeholder}>
            <img src="/images/Messaging.svg" width='200px' height='200px'/>
            <h4>Start A Conversation!</h4>
        </div>
    )


    return (
        <div className={style.ChatRoom}>
            <div className={style.ChatHeader}>
                <div className={style.User}>
                    <div className={style.ImageSide}><img src={User.imagePath}/></div>
                    <div className={style.InfoSide}>
                        <div className={style.Name} style={{
                            marginTop: User.status ? null : '15px',
                        }}>{User.name}</div>
                        
                        <div className={style.Status} style={{
                            opacity: User.status ? 1 : 0,
                        }}>{User.status ? 'Online' : null}</div>
                        
                    </div>
                </div>
                <div className={style.toggleButton}>
                <FontAwesomeIcon icon={faBars} 
                style={{fontSize: '35px', cursor: 'pointer', color: '#333'}}
                onClick={props.toggleHandler}/>
                </div>
            </div>
            
            <div id="ChatRoom" className={style.ReadingSide}>
                {Messages?.map((message, index) => {
                    return <Message
                    key={index}
                    message={message} 
                    auth={auth.user._id}/>
                })}
                {Messages.length === 0 ? placeholder : null}
            </div>
            
            <div className={style.typingEffict} 
            style={{
                display: typingEffect ? 'block' : 'none',
            }}>typing...</div>
            
            <div className={style.WritingSide}>
                <div className={style.ToolContainer}></div>
                <div className={style.InputContainer}>
                    <div className={style.InputSide}>
                        <input 
                        value={newMessage}
                        type="text" 
                        placeholder="Type A Message" 
                        onChange={(e) => inputChangeHandler(e)}/>
                    </div>
                    <div className={style.ButtonSide}>
                        <div className={style.buttonBackground} 
                        style={{background: newMessage ? '#333' : '#b3b3b3'}} 
                        onClick={newMessage ? sendMessageHandler : null}>
                            <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={{fontSize: '23px', color: '#fff', marginLeft: '-4px'}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;