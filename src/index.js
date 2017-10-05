import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Redirect, Route, BrowserRouter, IndexRoute} from 'react-router-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';

import './index.css';
import './style/style.css';

import App from './components/common/App';
import Teachers from './components/teacher/Teachers';
import Home from './components/common/Home';
import Students from './components/common/Students';
import Configuration from './components/common/Configuration';
import StudentPage from './components/student/StudentPage';
import Course from './components/common/Course';
import CoursePage from './components/courses/CoursePage'
import Login from './components/common/Login'


const networkInterface = createNetworkInterface({
    uri: 'https://effeedbackapp-dev.herokuapp.com/api/graphql'
    //uri: 'https://effeedbackapp-qa.herokuapp.com/api/graphql'
});

networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {};  // Create the header object if needed.
        }
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('token');
        token ? req.options.headers.authorization = `Bearer ${token}` : null;

        next();
    }

}]);

networkInterface.useAfter([{
    applyAfterware({ response }, next) {
        if (response.status === 500 || response.status === 401) {
            window.location.replace('/');
            localStorage.removeItem('token');
            localStorage.removeItem('userID')
            .then(() =>
                client.resetStore()
            )
            .catch(err =>
                console.error('Logout failed', err)
            );
        }
        next();
    }
}]);

const client = new ApolloClient({
    networkInterface,
});



const Root = () => {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App>
                    <Switch>
                        <Route  exact path="/signin" component={Login}/>
                        <AuthenticatedRoute  exact path="/configuration" component={Configuration}/>
                        <AuthenticatedRoute  exact path="/students/" component={Students}/>
                        <AuthenticatedRoute  exact path="/:courseID" component={Course}/>
                        <AuthenticatedRoute  exact path="/:courseID/class" component={CoursePage}/>
                        <AuthenticatedRoute  exact path="/" component={Home}/>
                        <AuthenticatedRoute  path="/:courseID/students/:userID" component={StudentPage}/>
                    </Switch>
                </App>
            </BrowserRouter >
        </ApolloProvider>

    );
};

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('token') ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
            }}/>
        )
    )}/>
);


ReactDOM.render(<Root />, document.getElementById('root'));
