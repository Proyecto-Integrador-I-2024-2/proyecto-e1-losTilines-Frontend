// hooks/useNavigateWithQuery.js
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryParams } from "@/hooks/utils/useQueryParams";

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
