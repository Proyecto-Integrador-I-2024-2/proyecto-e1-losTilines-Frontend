import { useLocation, useNavigate } from 'react-router-dom';

// This hook is used to manage query params in the URL, set and get them.

export const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getParams = () => {
    return new URLSearchParams(location.search);
  };

  const setParams = (params) => {
    const searchParams = new URLSearchParams(location.search);
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.set(key, params[key]);
      } else {
        searchParams.delete(key);
      }
    }); 
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  return { getParams, setParams };
};

