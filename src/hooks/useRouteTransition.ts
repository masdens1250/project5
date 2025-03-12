import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useRouteTransition = () => {
  const location = useLocation();

  useEffect(() => {
    // Faire défiler vers le haut lors du changement de route
    window.scrollTo(0, 0);

    // Mettre à jour le titre de la page
    const route = routes.find(r => r.path === location.pathname);
    if (route) {
      document.title = `${route.title} | مستشار التوجيه المتقدم`;
    }
  }, [location]);

  return location;
};