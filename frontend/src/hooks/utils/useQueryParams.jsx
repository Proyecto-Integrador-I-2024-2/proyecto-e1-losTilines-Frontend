import { useLocation, useNavigate } from 'react-router-dom';

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

