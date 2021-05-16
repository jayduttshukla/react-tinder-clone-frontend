import React from 'react'
import './SwipeButtons.css'
import IconButton from '@material-ui/core/IconButton';
import ReplyIcon from '@material-ui/icons/Reply';
import CloseIcon from '@material-ui/icons/Close';
import StarRateIcon from '@material-ui/icons/StarRate';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FlashOnIcon from '@material-ui/icons/FlashOn';

function SwipeButtons() {
    return (
        <div className="swpieButtons">
            <IconButton className="swpieButton_item swpieButtons_repeat">
                <ReplyIcon fontSize="large"/>
            </IconButton>
            <IconButton className="swpieButton_item swpieButtons_left">
                <CloseIcon fontSize="large"/>
            </IconButton>
            <IconButton className="swpieButton_item swpieButtons_start">
                <StarRateIcon fontSize="large"/>
            </IconButton>
            <IconButton className="swpieButton_item swpieButtons_right">
                <FavoriteIcon fontSize="large"/>
            </IconButton>
            <IconButton className="swpieButton_item swpieButtons_lightining">
                <FlashOnIcon fontSize="large"/>
            </IconButton>
        </div>
    )
}

export default SwipeButtons;
