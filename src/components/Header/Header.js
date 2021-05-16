import React from 'react'
import "./Header.css"
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import ForumIcon from '@material-ui/icons/Forum';
import logo from '../../assets/logo.png';
import {useHistory } from "react-router-dom";
// import logo from '../../../src/assets/logo.png'


function Header(props) {
  let history = useHistory();
    return (
        <div className="header">
           <IconButton onClick={() => history.push({pathname : '/profile'})}>
             <PersonIcon fontSize="large" className="header_icon"/>
           </IconButton>
            <IconButton onClick={props.notInMain ? () => history.push({pathname : '/cards'}) : () => {}} >
              <img 
              className="header_logo"
              src={logo} />
            </IconButton>
            <IconButton>
             <ForumIcon fontSize="large" className="header_icon"/>
           </IconButton>
        </div>
    )
}

export default Header
