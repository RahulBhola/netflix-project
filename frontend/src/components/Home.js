import React from 'react';
import Header from "./Header";
import RandomVideo from './RandomVideo';
import RecentlyAdded from './RecentlyAdded';
// import Movies from './Movies';

function Home() {
    return (
        <div className='bg-black'>
            <Header />
            <RandomVideo />
            <RecentlyAdded />
            {/* <Movies/> */}
        </div>
    );
}

export default Home;
