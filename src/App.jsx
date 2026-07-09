import { useEffect } from 'react';
import TabWithFullDates from './TabWithFullDates.jsx';

export default function App() {
  useEffect(() => {
    document.body.classList.add('cahier-tab-active');
    document.body.classList.remove('devoir-tab-active');

    return () => {
      document.body.classList.remove('cahier-tab-active');
    };
  }, []);

  return <TabWithFullDates />;
}
