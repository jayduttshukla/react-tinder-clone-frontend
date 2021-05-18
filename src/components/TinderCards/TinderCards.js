import React, {useState, useEffect} from 'react';
import './TinderCards.css';
import './../SwipeButtons/SwipeButtons.css'
import TinderCard from 'react-tinder-card';
import axios from './../../axios';
import {useHistory } from "react-router-dom";
import { AuthContext } from "../../App";

import IconButton from '@material-ui/core/IconButton';
import ReplyIcon from '@material-ui/icons/Reply';
import CloseIcon from '@material-ui/icons/Close';
import StarRateIcon from '@material-ui/icons/StarRate';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import config from '../../config';

const alreadyRemoved = []
let childRefs;
function TinderCards() {
    let history = useHistory();
    const { isAuthenticated, state } = React.useContext(AuthContext);
    const [people, setPeople] = useState([]);
    const [loggeInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [childRefList, setChildRefList] = useState([]);

    useEffect(() => {
      async function fetchData() {
          if(loggeInUser) {  
            axios.post('/api/users/getSuggestedCards', {userId: loggeInUser._id}).then(response => {
                let data = response.data.data;
                if(response.data.status === 1) {
                    data.map((item) => {
                        console.log('item.imgUrl ', item.imgUrl)
                        item.imgUrl = config.BASE_URL + '/' + item.imgUrl.replace(/\\/g, "/");
                    })
                setPeople(data);
                childRefs = () => Array(data.length).fill(0).map(i => React.createRef())
                setChildRefList(childRefs);  
                }
            })
          }
         
      } 
      console.log('isAuthenticated ', isAuthenticated)

      if(localStorage.getItem('token')){
        fetchData();
      } else {
        history.push({ pathname: "/" });
      }
    }, [])
   
    const swiped = (dir, id) =>{
        if(dir === "right") {
            // Right swipe
            console.log(`interested in ${id}`)
        } else {
            // Left swipe
            console.log(`not interested in ${id}`)
        }
        // setLastDirection(dir)
    }
    const outOfFrame = (name) => {
        // console.log(name + ' left screen')
    }

    const swipe = (dir) => {
        const cardsLeft = people.filter(person => !alreadyRemoved.includes(person.name))
        if (cardsLeft.length && childRefList.length > 0) {
          const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
          const index = people.map(person => person.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
          alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
          childRefList[index].current.swipe(dir) // Swipe the card!
        }
      }
    return (
        <div className="tinderCards">
            <div className="tinderCards_cardContainer">
                {people.map((person, index) => {
                    return (
                        <TinderCard 
                            
                            ref={childRefList[index]}
                            className="swipe"
                            key={person.name}
                            preventSwipe={['down']}
                            onSwipe={(dir)=> swiped(dir, person._id)}
                            onCardLeftScreen={()=> outOfFrame(person.name)}
                        >
                            <div style={{backgroundImage: `url(${person.imgUrl})`}} className="tinder-card">
                                <h3>{person.name}</h3>  
                            </div>
                        </TinderCard>
                        )
                })}
            </div>   
            <div className="swpieButtons" >
                <IconButton className="swpieButton_item swpieButtons_repeat">
                    <ReplyIcon fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => swipe('left')} className="swpieButton_item swpieButtons_left">
                    <CloseIcon fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => swipe('up')} className="swpieButton_item swpieButtons_start">
                    <StarRateIcon fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => swipe('right')}  className="swpieButton_item swpieButtons_right">
                    <FavoriteIcon fontSize="large"/>
                </IconButton>
                <IconButton className="swpieButton_item swpieButtons_lightining">
                    <FlashOnIcon fontSize="large"/>
                </IconButton>
            </div>
   
        </div>
    )
}

export default TinderCards;
