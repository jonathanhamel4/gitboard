import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFetch } from '../utils/fetch';
import Unauthorized from './Unauthorized';
import urls from '../apiUrls';

export default function AuthRoute({ children }) {
  const [isAuthed, setIsAuthed] = useState(null);

  async function fetchOauthStatus() {
    console.log(urls);
    const { data, isError } = await getFetch(urls.oauth.verify, 'Error verifying identity');
    if (isError) {
      setIsAuthed(false);
    }
    setIsAuthed(!!data.isAuth);
  }

  useEffect(() => {
    fetchOauthStatus();
  }, []);


  return (
    <>
      { isAuthed === true && children }
      { isAuthed === false && <Unauthorized /> }
    </>
  );
}

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired
};
