import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Board from './components/Board';
import FetchData from './components/FetchData';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/board' component={Board} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
