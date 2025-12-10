import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import Loading from '../Components/Loading/Loading';

const PrivateRoute = ({children}) => {
    let {user, loading} = UseAuth();

    if(loading) {
        return <Loading></Loading>
    }

    return (
        <div>
            
        </div>
    );
};

export default PrivateRoute;