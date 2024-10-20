// hooks/useNavigateWithQuery.js
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryParams } from "@/hooks/utils/useQueryParams";



// This hook is used to navigate to a new path with the current query params.
export const useNavigateWithQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getParams } = useQueryParams();

  const navigateWithCurrentParams = (path) => {
    const currentParams = getParams();
    navigate({
      pathname: path,
      search: `?${currentParams.toString()}`,
    });
  };

  return navigateWithCurrentParams;
};

export default useNavigateWithQuery;
