import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import { useToast } from './ToastContext';

type PermissionType = 'camera' | 'photo' | 'location' | 'notification';

interface PermissionsContextData {
  permissions: Record<PermissionType, boolean>;
  checkPermission: (permission: PermissionType) => Promise<boolean>;
  requestPermission: (permission: PermissionType) => Promise<boolean>;
  checkAndRequestPermission: (permission: PermissionType) => Promise<boolean>;
}

const PermissionsContext = createContext<PermissionsContextData>(
  {} as PermissionsContextData
);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<Record<PermissionType, boolean>>({
    camera: false,
    photo: false,
    location: false,
    notification: false,
  });
  const { showToast } = useToast();

  // Helper to get the correct notification permission key for iOS
  const getIosNotificationPermission = () => {
    // @ts-expect-error: Some versions use NOTIFICATION_CENTER, some use NOTIFICATIONS
    return PERMISSIONS.IOS.NOTIFICATIONS || PERMISSIONS.IOS.NOTIFICATION_CENTER;
  };

  // Helper to get the correct notification permission key for Android
  const getAndroidNotificationPermission = () => {
    // @ts-expect-error: Some versions use POST_NOTIFICATIONS, fallback to a safe default
    return PERMISSIONS.ANDROID.POST_NOTIFICATIONS || PERMISSIONS.ANDROID.ACCESS_NOTIFICATION_POLICY;
  };

  const getPermissionType = (permission: PermissionType): Permission => {
    switch (permission) {
      case 'camera':
        return Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        }) as Permission;
      case 'photo':
        return Platform.select({
          android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        }) as Permission;
      case 'location':
        return Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }) as Permission;
      case 'notification':
        return Platform.select({
          android: getAndroidNotificationPermission(),
          ios: getIosNotificationPermission(),
        }) as Permission;
      default:
        throw new Error(`Unknown permission type: ${permission}`);
    }
  };

  const checkPermission = useCallback(
    async (permission: PermissionType): Promise<boolean> => {
      try {
        const permissionType = getPermissionType(permission);
        const result = await check(permissionType);
        const isGranted = result === RESULTS.GRANTED;
        setPermissions((prev) => ({ ...prev, [permission]: isGranted }));
        return isGranted;
      } catch (error) {
        console.error(`Error checking ${permission} permission:`, error);
        return false;
      }
    },
    []
  );

  const requestPermission = useCallback(
    async (permission: PermissionType): Promise<boolean> => {
      try {
        const permissionType = getPermissionType(permission);
        const result = await request(permissionType);
        const isGranted = result === RESULTS.GRANTED;
        setPermissions((prev) => ({ ...prev, [permission]: isGranted }));

        if (!isGranted) {
          showToast(
            `Please grant ${permission} permission in settings`,
            'warning'
          );
        }

        return isGranted;
      } catch (error) {
        console.error(`Error requesting ${permission} permission:`, error);
        return false;
      }
    },
    [showToast]
  );

  const checkAndRequestPermission = useCallback(
    async (permission: PermissionType): Promise<boolean> => {
      const isGranted = await checkPermission(permission);
      if (!isGranted) {
        return requestPermission(permission);
      }
      return true;
    },
    [checkPermission, requestPermission]
  );

  useEffect(() => {
    const checkAllPermissions = async () => {
      const permissionTypes: PermissionType[] = [
        'camera',
        'photo',
        'location',
        'notification',
      ];

      for (const permission of permissionTypes) {
        await checkPermission(permission);
      }
    };

    checkAllPermissions();
  }, [checkPermission]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        checkPermission,
        requestPermission,
        checkAndRequestPermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextData => {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }

  return context;
}; 