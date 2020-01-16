const getFetch = async (uri) => {
  const options = {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      DRW_SSO_NO_REDIRECT: 'true'
    }
  };

  let data = null;
  let err = null;

  try {
    const result = await fetch(uri, options);
    if (result.ok) {
      data = await result.json();
    } else if (result.status === 403) {
      window.location.reload(true);
    } else {
      throw Error(result.statusText);
    }
  } catch (e) {
    err = e;
  }

  return { data, err };
};

export default getFetch;
