import React from 'react';
import ReactLoading from 'react-loading';
 
const Loading = () => (
    <div className="loading">
        <ReactLoading type="spin" color="#3125a1" height={'10%'} width={'10%'} />
    </div>
);
 
export default Loading;