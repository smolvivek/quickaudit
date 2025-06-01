import {io} from 'socket.io-client';
import {store} from '../redux/store';
import {
  setLastSync,
  incrementPendingSyncCount,
  decrementPendingSyncCount,
} from '../redux/slices/networkSlice';
import {syncService} from './syncService';
import {databaseService} from './databaseService';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  initialize(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    // Initialize socket with auth token
    this.socket = io(process.env.REACT_APP_API_URL, {
      auth: {token},
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', error => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Handle real-time updates
    this.socket.on('audit:update', this.handleAuditUpdate.bind(this));
    this.socket.on('action:update', this.handleActionUpdate.bind(this));
    this.socket.on('template:update', this.handleTemplateUpdate.bind(this));
    this.socket.on('user:update', this.handleUserUpdate.bind(this));
  }

  async handleAuditUpdate(data) {
    try {
      // Update local database
      await databaseService.auditRepository.update(data.id, {
        ...data,
        syncStatus: 'synced',
      });

      // Update Redux store
      store.dispatch(setLastSync(Date.now().toString()));
    } catch (error) {
      console.error('Error handling audit update:', error);
    }
  }

  async handleActionUpdate(data) {
    try {
      // Update local database
      await databaseService.actionRepository.update(data.id, {
        ...data,
        syncStatus: 'synced',
      });

      // Update Redux store
      store.dispatch(setLastSync(Date.now().toString()));
    } catch (error) {
      console.error('Error handling action update:', error);
    }
  }

  async handleTemplateUpdate(data) {
    try {
      // Update local database
      await databaseService.templateRepository.update(data.id, {
        ...data,
        syncStatus: 'synced',
      });

      // Update Redux store
      store.dispatch(setLastSync(Date.now().toString()));
    } catch (error) {
      console.error('Error handling template update:', error);
    }
  }

  async handleUserUpdate(data) {
    try {
      // Update local database
      await databaseService.userRepository.update(data.id, {
        ...data,
        syncStatus: 'synced',
      });

      // Update Redux store
      store.dispatch(setLastSync(Date.now().toString()));
    } catch (error) {
      console.error('Error handling user update:', error);
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff

      setTimeout(() => {
        this.socket.connect();
      }, this.reconnectDelay);
    }
  }

  // Emit events
  emitAuditUpdate(audit) {
    if (this.isConnected) {
      this.socket.emit('audit:update', audit);
      store.dispatch(incrementPendingSyncCount());
    }
  }

  emitActionUpdate(action) {
    if (this.isConnected) {
      this.socket.emit('action:update', action);
      store.dispatch(incrementPendingSyncCount());
    }
  }

  emitTemplateUpdate(template) {
    if (this.isConnected) {
      this.socket.emit('template:update', template);
      store.dispatch(incrementPendingSyncCount());
    }
  }

  emitUserUpdate(user) {
    if (this.isConnected) {
      this.socket.emit('user:update', user);
      store.dispatch(incrementPendingSyncCount());
    }
  }

  // Cleanup
  cleanup() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();
