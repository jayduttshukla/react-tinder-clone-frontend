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
const alreadyRemoved = []
let childRefs;
function TinderCards() {
    let history = useHistory();
    const { isAuthenticated } = React.useContext(AuthContext);
    const [people, setPeople] = useState([]);
    const [childRefList, setChildRefList] = useState([]);

    useEffect(() => {
      async function fetchData() {
          const req = await axios.get('/api/tinder/cards');
          setPeople(req.data);  
      } 
      console.log('isAuthenticated ', isAuthenticated)
      fetchData();
      if(localStorage.getItem('token')){
        fetchData();
      } else {
        history.push({ pathname: "/" });
      }
    }, [])
   
    useEffect(() => {
        childRefs = () => Array(people.length).fill(0).map(i => React.createRef())
        setChildRefList(childRefs);
    }, [people]);
    const swiped = (dir, nameToDelete) =>{
        if(dir === "right") {
            // Right swipe
            console.log(`interested in ${nameToDelete}`)
        } else {
            // Left swipe
            console.log(`not interested in ${nameToDelete}`)
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
                            onSwipe={(dir)=> swiped(dir, person.name)}
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
