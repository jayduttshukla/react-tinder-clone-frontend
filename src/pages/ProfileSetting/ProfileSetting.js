import React, {useState, useEffect } from 'react'
import './ProfileSetting.css';
import Header from '../../components/Header/Header';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../App";
import {useHistory } from "react-router-dom";
import axiosMiddleware from './../../axios';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    logout: {
        margin: theme.spacing(3, 0, 2),
        width: '200px',
        margin: '0 auto',
        color: '#fff',
        marginBottom: '5vh',
        background:' linear-gradient(40deg ,#de4686 65%, #ff8544 100%); '
    },
    }));

    

function ProfileSetting() {
    let history = useHistory();
    const { dispatch, state  } = React.useContext(AuthContext);
    const [loggeInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
    const classes = useStyles();
    const [profileState, setProfileState] = useState({
        name: '',
        imgUrl: '',
        email: ''
    })
    // const [name , setname] = useState();
    // const [imgUrl , setimgUrl] = useState();
    // const [email , setemail] = useState();
    const getUserDetail = (userId) => {
        axiosMiddleware.get('/api/users/profile/' + userId)
          .then(resJson => {
              let data = resJson.data.data; 
              console.log('resJson.data ' , resJson.data); 
              if(resJson.data.status === 1) {
                let tempObj = {
                    name: data.name,
                    imgUrl: config.BASE_URL + '/' + data.imgUrl,
                    email: data.email
                }
                console.log('tempObj ', tempObj)
                setProfileState(tempObj)
              }
          })

    }
    
    useEffect(() => {
        console.log('profileState ', profileState)
    }, [profileState])
    useEffect(() => {
        if(history && localStorage.getItem("token") === null) {
          history.push({
              pathname: "/login"
          });  
        }
        console.log('state ', state )
        if(loggeInUser) {
            getUserDetail(loggeInUser._id)
        }
    }, []);

    const logout = () =>{
        dispatch({
            type: "LOGOUT",
        });
        history.push({
            pathname: "/login"
        });  
    }
    return (
        <div className="container">
            <Header notInMain={true} />
            <div className="profile-setting-container">
                <img src={profileState.imgUrl} className="profile_image"/>
                <p className="profile_name">{profileState.name}</p>
                <p className="profile_email">{profileState.email}</p>
                <Button className={classes.logout} onClick={logout}>Logout</Button>
            </div>
        </div>
    )
}

export default ProfileSetting
