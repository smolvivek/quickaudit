import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import OfflineManager from '../src/components/OfflineManager';

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  network: {
    isConnected: true,
    lastOnline: new Date().toISOString(),
    pendingSyncActions: [],
  },
};

// Mock child component
const MockChildComponent = () => <></>;

describe('OfflineManager', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders children when online', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <OfflineManager>
          <MockChildComponent testID="child-component" />
        </OfflineManager>
      </Provider>,
    );

    // Check if child component is rendered
    expect(getByTestId('child-component')).toBeTruthy();
  });

  it('renders children when offline', () => {
    const offlineState = {
      ...initialState,
      network: {
        ...initialState.network,
        isConnected: false,
      },
    };
    const offlineStore = mockStore(offlineState);

    const {getByTestId} = render(
      <Provider store={offlineStore}>
        <OfflineManager>
          <MockChildComponent testID="child-component" />
        </OfflineManager>
      </Provider>,
    );

    // Check if child component is rendered
    expect(getByTestId('child-component')).toBeTruthy();
  });

  it('shows offline banner when offline', () => {
    const offlineState = {
      ...initialState,
      network: {
        ...initialState.network,
        isConnected: false,
      },
    };
    const offlineStore = mockStore(offlineState);

    const {getByText} = render(
      <Provider store={offlineStore}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check if offline banner is shown
    expect(getByText('You are offline')).toBeTruthy();
  });

  it('does not show offline banner when online', () => {
    const {queryByText} = render(
      <Provider store={store}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check that offline banner is not shown
    expect(queryByText('You are offline')).toBeNull();
  });

  it('shows sync indicator when there are pending sync actions', () => {
    const pendingSyncState = {
      ...initialState,
      network: {
        ...initialState.network,
        pendingSyncActions: [
          {id: '1', type: 'CREATE_AUDIT', data: {auditId: '123'}},
          {
            id: '2',
            type: 'UPDATE_QUESTION',
            data: {questionId: '456', answer: 'yes'},
          },
        ],
      },
    };
    const pendingSyncStore = mockStore(pendingSyncState);

    const {getByText} = render(
      <Provider store={pendingSyncStore}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check if sync indicator is shown
    expect(getByText('2 changes pending sync')).toBeTruthy();
  });

  it('triggers sync when coming back online', async () => {
    // First render with offline state
    const offlineState = {
      ...initialState,
      network: {
        ...initialState.network,
        isConnected: false,
        pendingSyncActions: [
          {id: '1', type: 'CREATE_AUDIT', data: {auditId: '123'}},
        ],
      },
    };
    const offlineStore = mockStore(offlineState);

    const {rerender, getByText} = render(
      <Provider store={offlineStore}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check offline state
    expect(getByText('You are offline')).toBeTruthy();

    // Now change to online state
    const onlineState = {
      ...initialState,
      network: {
        ...initialState.network,
        isConnected: true,
        pendingSyncActions: [
          {id: '1', type: 'CREATE_AUDIT', data: {auditId: '123'}},
        ],
      },
    };
    const onlineStore = mockStore(onlineState);

    rerender(
      <Provider store={onlineStore}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check if sync was triggered
    const actions = onlineStore.getActions();
    expect(
      actions.some(action => action.type === 'network/syncPendingActions'),
    ).toBe(true);
  });

  it('shows sync success message after successful sync', async () => {
    // Setup store with successful sync state
    const successState = {
      ...initialState,
      network: {
        ...initialState.network,
        isConnected: true,
        syncStatus: 'success',
        lastSyncTime: new Date().toISOString(),
      },
    };
    const successStore = mockStore(successState);

    const {getByText} = render(
      <Provider store={successStore}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check if success message is shown
    expect(getByText('Sync completed successfully')).toBeTruthy();
  });

  it('shows sync error message after failed sync', async () => {
    // Setup store with failed sync state
    const errorState = {
      ...initialState,
      network: {
        ...initialState.network,
        isConnected: true,
        syncStatus: 'error',
        syncError: 'Failed to connect to server',
      },
    };
    const errorStore = mockStore(errorState);

    const {getByText} = render(
      <Provider store={errorStore}>
        <OfflineManager>
          <MockChildComponent />
        </OfflineManager>
      </Provider>,
    );

    // Check if error message is shown
    expect(getByText('Sync failed: Failed to connect to server')).toBeTruthy();
  });
});
