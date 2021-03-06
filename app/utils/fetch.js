import { toast } from 'react-semantic-toasts';

const handleError = (err, msg) => {
  if (err) {
    toast({
      type: 'error', icon: 'warning circle', title: 'Error', description: msg, animation: 'bounce', time: 5000
    });
    console.log(err);
    return true;
  }
  return false;
};

const getFetch = async (uri, errorMessage) => {
  const options = {
    credentials: 'include',
    cache: 'no-store'
  };

  let data = null;
  let err = null;

  try {
    const result = await fetch(uri, options);
    if (result.ok) {
      data = await result.json();
    } else {
      throw Error(result.statusText);
    }
  } catch (e) {
    err = e;
  }

  const isError = handleError(err, errorMessage);

  return { data, isError };
};

export { handleError, getFetch };
