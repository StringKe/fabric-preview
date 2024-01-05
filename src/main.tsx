import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './main.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import ReactDOM from 'react-dom/client';

import App from './app.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <Notifications />
        <App />
    </MantineProvider>,
);
