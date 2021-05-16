// import logo from './logo.svg';
import Header from './../components/Header/Header';
import SwipeButtons from './../components/SwipeButtons/SwipeButtons';
import TinderCards from './../components/TinderCards/TinderCards';

function MainScreen() {
  return (
    <div className="app">
      <Header />
      <TinderCards />
      {/* <SwipeButtons /> */}
    </div>
  );
}

export default MainScreen;
