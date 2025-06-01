/**
 * Script to fix PermissionsContext.tsx TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix PermissionsContext.tsx
const fixPermissionsContext = () => {
  const filePath = path.join(process.cwd(), 'src/contexts/PermissionsContext.tsx');
  
  const content = `/**
 * PermissionsContext
 * Manages app permissions (camera, location, etc.)
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

// Permission status type
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable' | 'limited' | 'unknown';

// Permission types
export type PermissionType = 'camera' | 'photo' | 'location' | 'notification' | 'microphone' | 'storage';

// Permissions state interface
interface PermissionsState {
  camera: PermissionStatus;
  photo: PermissionStatus;
  location: PermissionStatus;
  notification: PermissionStatus;
  microphone: PermissionStatus;
  storage: PermissionStatus;
}

// Permissions context interface
interface PermissionsContextType {
  permissions: PermissionsState;
  checkPermission: (type: PermissionType) => Promise<PermissionStatus>;
  requestPermission: (type: PermissionType) => Promise<PermissionStatus>;
  hasPermission: (type: PermissionType) => boolean;
}

// Default permissions state
const defaultPermissionsState: PermissionsState = {
  camera: 'unknown',
  photo: 'unknown',
  location: 'unknown',
  notification: 'unknown',
  microphone: 'unknown',
  storage: 'unknown'
};

// Create context with default values
const PermissionsContext = createContext<PermissionsContextType>({
  permissions: defaultPermissionsState,
  checkPermission: async () => 'unknown',
  requestPermission: async () => 'unknown',
  hasPermission: () => false
});

// Get platform-specific permission
const getPermission = (type: PermissionType): Permission => {
  const isIOS = Platform.OS === 'ios';
  
  switch (type) {
    case 'camera':
      return isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    case 'photo':
      return isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    case 'location':
      return isIOS ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    case 'notification':
      return isIOS ? PERMISSIONS.IOS.NOTIFICATIONS : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
    case 'microphone':
      return isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
    case 'storage':
      return isIOS ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    default:
      return isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  }
};

// Convert permission result to status
const mapResultToStatus = (result: string): PermissionStatus => {
  switch (result) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'blocked';
    case RESULTS.UNAVAILABLE:
      return 'unavailable';
    case RESULTS.LIMITED:
      return 'limited';
    default:
      return 'unknown';
  }
};

// Permissions provider component
export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsState>(defaultPermissionsState);
  
  // Check initial permissions on mount
  useEffect(() => {
    const checkInitialPermissions = async () => {
      const types: PermissionType[] = ['camera', 'photo', 'location', 'notification', 'microphone', 'storage'];
      
      const initialPermissions = { ...defaultPermissionsState };
      
      for (const type of types) {
        initialPermissions[type] = await checkPermission(type);
      }
      
      setPermissions(initialPermissions);
    };
    
    checkInitialPermissions();
  }, []);
  
  // Check permission
  const checkPermission = async (type: PermissionType): Promise<PermissionStatus> => {
    try {
      const permission = getPermission(type);
      const result = await check(permission);
      const status = mapResultToStatus(result);
      
      setPermissions(prev => ({
        ...prev,
        [type]: status
      }));
      
      return status;
    } catch (error) {
      console.error(\`Failed to check \${type} permission:\`, error);
      return 'unknown';
    }
  };
  
  // Request permission
  const requestPermission = async (type: PermissionType): Promise<PermissionStatus> => {
    try {
      const permission = getPermission(type);
      const result = await request(permission);
      const status = mapResultToStatus(result);
      
      setPermissions(prev => ({
        ...prev,
        [type]: status
      }));
      
      return status;
    } catch (error) {
      console.error(\`Failed to request \${type} permission:\`, error);
      return 'unknown';
    }
  };
  
  // Check if permission is granted
  const hasPermission = (type: PermissionType): boolean => {
    return permissions[type] === 'granted' || permissions[type] === 'limited';
  };
  
  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        checkPermission,
        requestPermission,
        hasPermission
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook for using permissions context
export const usePermissions = () => useContext(PermissionsContext);

export default PermissionsContext;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed PermissionsContext.tsx');
};

// Run the function
console.log('Fixing PermissionsContext...');
fixPermissionsContext();
console.log('PermissionsContext fixed successfully!');
