import '@/shared/styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';

import { render } from 'preact';
import { ToastContainer } from 'react-toastify';

import { ErrorBoundary } from '@/app/providers';
import { addHasOwn } from '@/shared/lib/func';

import App from './app/App';

addHasOwn();

render(
  <ErrorBoundary>
    <App />
    <ToastContainer />
  </ErrorBoundary>,
  document.getElementById('root')!
);
