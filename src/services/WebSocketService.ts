import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { setLastSync, incrementPendingSyncCount, decrementPendingSyncCount } from '../redux/slices/networkSlice';
import { syncService } from './syncService';
import { databaseService } from './databaseService';

interface WebSocketEvent {
  type: string;
  data: any;
}

interface AuditEvent extends WebSocketEvent {
  type: 'audit.created' | 'audit.updated' | 'audit.deleted';
  data: {
    audit: {
      id: number;
      title: string;
      description: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface FindingEvent extends WebSocketEvent {
  type: 'finding.created' | 'finding.updated' | 'finding.deleted';
  data: {
    finding: {
      id: number;
      auditId: number;
      title: string;
      description: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

class WebSocketService {
  private socket: SocketIOClient.Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }

    const token = store.getState().auth.token;
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    this.socket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      store.dispatch(setLastSync(Date.now()));
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Handle real-time updates
    this.socket.on('audit.update', (event: AuditEvent) => {
      this.handleAuditUpdate(event);
    });

    this.socket.on('finding.update', (event: FindingEvent) => {
      this.handleFindingUpdate(event);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff
      setTimeout(() => {
        this.initializeWebSocket();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private async handleAuditUpdate(event: AuditEvent) {
    try {
      store.dispatch(incrementPendingSyncCount());
      await databaseService.updateAudit(event.data.audit);
      store.dispatch(decrementPendingSyncCount());
      store.dispatch(setLastSync(Date.now()));
    } catch (error) {
      console.error('Error handling audit update:', error);
      syncService.addToSyncQueue({
        type: event.type,
        data: event.data
      });
    }
  }

  private async handleFindingUpdate(event: FindingEvent) {
    try {
      store.dispatch(incrementPendingSyncCount());
      await databaseService.updateFinding(event.data.finding);
      store.dispatch(decrementPendingSyncCount());
      store.dispatch(setLastSync(Date.now()));
    } catch (error) {
      console.error('Error handling finding update:', error);
      syncService.addToSyncQueue({
        type: event.type,
        data: event.data
      });
    }
  }

  public send(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.error('WebSocket not connected');
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    }
  }
}

export const websocketService = new WebSocketService();
