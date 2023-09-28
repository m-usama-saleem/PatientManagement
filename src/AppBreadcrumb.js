import React from 'react';
import { useLocation } from 'react-router-dom';

const AppBreadcrumb = (props) => {
    const location = useLocation();
    const label = props.meta.label;
    return <>{location.pathname === '/' ? <span>Dashboard</span> : <span>{label}</span>}</>;
};

export default AppBreadcrumb;
