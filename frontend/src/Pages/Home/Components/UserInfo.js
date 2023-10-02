import React, { useContext } from "react";
import style from './UserInfo.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../Context/AuthContext";

const UserInfo = (props) => {
    const auth = useContext(AuthContext);
    return (
        <div className={style.UserInfo}>
            <div className={style.imageSide}>
                <img src={auth.user.imagePath}/>
                <div className={style.menuBar} onClick={props.logOutHandler}>
                    <FontAwesomeIcon icon={faPowerOff} style={{color: '#cd0000'}} title="LogOut"/>
                </div>
                </div>
            <div className={style.nameSide}>{auth.user.name}</div>
        </div>
    )
}

export default UserInfo;