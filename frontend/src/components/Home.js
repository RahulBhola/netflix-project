import React from 'react';
import Header from "./Header";
import RandomVideo from './RandomVideo';
import RecentlyAdded from './RecentlyAdded';
import Movies from './Movies';

function Home() {
    return (
        <div>
            <Header />
            <RandomVideo />
            <RecentlyAdded />
            <Movies/>
        </div>
    );
}

export default Home;
