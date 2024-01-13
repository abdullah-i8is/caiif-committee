import { notification } from 'antd';
import React, { useEffect } from 'react';

const Notification = (type, message) => {
    const [api, contextHolder] = notification.useNotification();
    const Context = React.createContext({
        name: 'Default',
    });
    useEffect(() => {
        if (type) {
            api.info({
                message: `Notification`,
                description: <Context.Consumer>{message}</Context.Consumer>,
                placement,
            });
        }
    }, [type])
    return contextHolder
}

export default Notification;