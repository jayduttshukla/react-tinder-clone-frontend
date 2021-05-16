import React from 'react'
import './ProfileSetting.css';
import Header from '../../components/Header/Header';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../App";
import {useHistory } from "react-router-dom";

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
    const classes = useStyles();

    React.useEffect(() => {
        if(history && localStorage.getItem("token") === null) {
          history.push({
              pathname: "/login"
          });  
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
                <p style={{marginBottom: '15px'}}>Profile Setting</p>
                <Button className={classes.logout} onClick={logout}>Logout</Button>
            </div>
        </div>
    )
}

export default ProfileSetting
