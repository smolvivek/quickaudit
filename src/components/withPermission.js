import React from 'react';
import { useSelector } from 'react-redux';
import PermissionService from '../services/permissionService';

export const withPermission = (WrappedComponent, requiredPermissions) => {
  return function WithPermissionComponent(props) {
    const user = useSelector(state => state.auth.user);
    const [hasPermission, setHasPermission] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const checkPermissions = async () => {
        if (!user) {
          setHasPermission(false);
          setLoading(false);
          return;
        }

        try {
          const hasAccess = await PermissionService.checkPermissions(
            user.id,
            Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
          );
          setHasPermission(hasAccess);
        } catch (error) {
          console.error('Permission check failed:', error);
          setHasPermission(false);
        } finally {
          setLoading(false);
        }
      };

      checkPermissions();
    }, [user, requiredPermissions]);

    if (loading) {
      return null; // Or a loading spinner
    }

    if (!hasPermission) {
      return null; // Or an access denied component
    }

    return <WrappedComponent {...props} />;
  };
};

export default withPermission; 