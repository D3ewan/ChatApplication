import React from "react";
import style from './Message.module.css';

const Message = (props) => {
    // let classes = [style.Message]
    // props.message.creatorID == props.auth ? classes.push('MyMessages') : classes.push('OtherMessages');

    return (
        <div className={style.Message} 
        style={{
            backgroundColor: props.message.creatorID == props.auth ? '#edb100' : '#384850',
            alignSelf: props.message.creatorID == props.auth ? 'flex-end' : 'flex-start',
            borderTopLeftRadius: props.message.creatorID == props.auth ? '20px' : '0px',
            borderTopRightRadius: props.message.creatorID == props.auth ? '0px' : '20px',
        }}>
            <div className={style.MessageText}>{props.message.text}</div>
            <div className={style.MessageStatus}>{props.message.time}</div>
        </div>
    )
}

export default Message;