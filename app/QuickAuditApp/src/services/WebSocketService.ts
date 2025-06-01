/**
 * WebSocket Service
 * Handles real-time communication with the server
 */

import { Platform } from 'react-native';

interface WebSocketMessage {
  type: string;
  payload: any;
}

interface WebSocketOptions {
  reconnect: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private options: WebSocketOptions;
  private reconnectAttempts: number = 0;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  
  constructor(url: string, options: Partial<WebSocketOptions> = {}) {
    this.url = url;
    this.options = {
      reconnect: options.reconnect ?? true,
      reconnectInterval: options.reconnectInterval ?? 5000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 5
    };
  }
  
  /**
   * Connect to the WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket closed');
          this.handleReconnect();
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  
  /**
   * Send a message to the WebSocket server
   * @param type Message type
   * @param payload Message payload
   */
  public send(type: string, payload: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    const message: WebSocketMessage = { type, payload };
    this.socket.send(JSON.stringify(message));
  }
  
  /**
   * Add a listener for a specific message type
   * @param type Message type
   * @param callback Callback function
   */
  public addListener(type: string, callback: (data: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    
    this.listeners.get(type)?.push(callback);
  }
  
  /**
   * Remove a listener for a specific message type
   * @param type Message type
   * @param callback Callback function
   */
  public removeListener(type: string, callback: (data: any) => void): void {
    if (!this.listeners.has(type)) return;
    
    const callbacks = this.listeners.get(type) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }
  
  /**
   * Handle an incoming message
   * @param message WebSocket message
   */
  private handleMessage(message: WebSocketMessage): void {
    const { type, payload } = message;
    
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type) || [];
      callbacks.forEach(callback => callback(payload));
    }
  }
  
  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (!this.options.reconnect) return;
    
    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      console.log(`Reconnecting (attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.options.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}

export default new WebSocketService('wss://api.quickaudit.com/ws');
