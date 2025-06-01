/**
 * Location Service
 * Handles location-related functionality
 */

import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  distanceFilter?: number;
}

class LocationService {
  private defaultOptions: LocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
    distanceFilter: 10
  };
  
  /**
   * Request location permissions
   * @returns Promise resolving to a boolean indicating if permission was granted
   */
  private async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      // iOS handles permissions through info.plist
      return true;
    }
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'QuickAudit needs access to your location for audit geo-tagging.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }
  
  /**
   * Get current location
   * @param options Location options
   * @returns Promise resolving to location
   */
  public async getCurrentLocation(options: LocationOptions = {}): Promise<Location> {
    const hasPermission = await this.requestLocationPermission();
    
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }
    
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          
          resolve(location);
        },
        (error) => {
          reject(new Error(`Failed to get location: ${error.message}`));
        },
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge
        }
      );
    });
  }
  
  /**
   * Watch location changes
   * @param callback Callback function for location updates
   * @param options Location options
   * @returns Watch ID for clearing the watch
   */
  public watchLocation(
    callback: (location: Location) => void,
    options: LocationOptions = {}
  ): number {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    return Geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        
        callback(location);
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: mergedOptions.maximumAge,
        distanceFilter: mergedOptions.distanceFilter
      }
    );
  }
  
  /**
   * Clear location watch
   * @param watchId Watch ID to clear
   */
  public clearWatch(watchId: number): void {
    Geolocation.clearWatch(watchId);
  }
  
  /**
   * Calculate distance between two locations (in meters)
   * @param location1 First location
   * @param location2 Second location
   * @returns Distance in meters
   */
  public calculateDistance(location1: Location, location2: Location): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (location1.latitude * Math.PI) / 180;
    const φ2 = (location2.latitude * Math.PI) / 180;
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180;
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180;
    
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }
}

export default new LocationService();