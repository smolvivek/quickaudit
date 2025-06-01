import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import AuditExecutionScreen from '../src/screens/field_auditor/AuditExecutionScreen';

// Mock the navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setOptions: jest.fn(),
};

// Mock route params
const route = {
  params: {
    auditId: '123',
    templateId: '456',
  },
};

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  audits: {
    currentAudit: {
      id: '123',
      title: 'Test Audit',
      templateId: '456',
      status: 'in_progress',
      sections: [
        {
          id: 's1',
          title: 'General Information',
          questions: [
            {
              id: 'q1',
              text: 'Is the area clean?',
              type: 'yes_no',
              required: true,
              answer: null,
            },
            {
              id: 'q2',
              text: 'Rate the overall condition',
              type: 'rating',
              required: true,
              answer: null,
            },
          ],
        },
        {
          id: 's2',
          title: 'Safety Checks',
          questions: [
            {
              id: 'q3',
              text: 'Are fire extinguishers accessible?',
              type: 'yes_no',
              required: true,
              answer: null,
            },
            {
              id: 'q4',
              text: 'Additional comments',
              type: 'text',
              required: false,
              answer: null,
            },
          ],
        },
      ],
      location: 'Test Location',
      score: null,
      maxScore: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    loading: false,
    error: null,
  },
  network: {
    isConnected: true,
  },
};

describe('AuditExecutionScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly with audit data', () => {
    const {getByText, getAllByText} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Check if important elements are rendered
    expect(getByText('Test Audit')).toBeTruthy();
    expect(getByText('General Information')).toBeTruthy();
    expect(getByText('Safety Checks')).toBeTruthy();
    expect(getByText('Is the area clean?')).toBeTruthy();
    expect(getByText('Are fire extinguishers accessible?')).toBeTruthy();
  });

  it('shows progress indicator', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Check if progress indicator is shown
    expect(getByTestId('audit-progress')).toBeTruthy();
  });

  it('handles yes/no question answers', () => {
    const {getByText} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Answer a yes/no question
    fireEvent.press(getByText('Yes'));

    // Check if the action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('audits/updateQuestionAnswer');
    expect(actions[0].payload.questionId).toBe('q1');
    expect(actions[0].payload.answer).toBe('yes');
  });

  it('handles rating question answers', () => {
    const {getAllByTestId} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Get rating stars and press one
    const stars = getAllByTestId('rating-star');
    fireEvent.press(stars[3]); // 4 out of 5

    // Check if the action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('audits/updateQuestionAnswer');
    expect(actions[0].payload.questionId).toBe('q2');
    expect(actions[0].payload.answer).toBe(4);
  });

  it('handles text input answers', () => {
    const {getByPlaceholderText} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Enter text in the comments field
    const textInput = getByPlaceholderText('Enter your comments');
    fireEvent.changeText(textInput, 'This is a test comment');

    // Check if the action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('audits/updateQuestionAnswer');
    expect(actions[0].payload.questionId).toBe('q4');
    expect(actions[0].payload.answer).toBe('This is a test comment');
  });

  it('validates required questions before submission', () => {
    const {getByText} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Try to complete the audit without answering required questions
    fireEvent.press(getByText('Complete Audit'));

    // Check if validation error is shown
    expect(getByText('Please answer all required questions')).toBeTruthy();
  });

  it('handles audit completion when all required questions are answered', () => {
    // Create a store with all questions answered
    const answeredState = {
      ...initialState,
      audits: {
        ...initialState.audits,
        currentAudit: {
          ...initialState.audits.currentAudit,
          sections: [
            {
              ...initialState.audits.currentAudit.sections[0],
              questions: [
                {
                  ...initialState.audits.currentAudit.sections[0].questions[0],
                  answer: 'yes',
                },
                {
                  ...initialState.audits.currentAudit.sections[0].questions[1],
                  answer: 4,
                },
              ],
            },
            {
              ...initialState.audits.currentAudit.sections[1],
              questions: [
                {
                  ...initialState.audits.currentAudit.sections[1].questions[0],
                  answer: 'yes',
                },
                {
                  ...initialState.audits.currentAudit.sections[1].questions[1],
                  answer: 'Test comment',
                },
              ],
            },
          ],
        },
      },
    };
    const answeredStore = mockStore(answeredState);

    const {getByText} = render(
      <Provider store={answeredStore}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Complete the audit
    fireEvent.press(getByText('Complete Audit'));

    // Check if the complete action was dispatched
    const actions = answeredStore.getActions();
    expect(actions[0].type).toBe('audits/completeAudit');
    expect(actions[0].payload.auditId).toBe('123');

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('ReportSummary', {
      auditId: '123',
    });
  });

  it('shows offline indicator when offline', () => {
    const offlineState = {
      ...initialState,
      network: {
        isConnected: false,
      },
    };
    const offlineStore = mockStore(offlineState);

    const {getByText} = render(
      <Provider store={offlineStore}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Check if offline indicator is shown
    expect(getByText('Offline Mode')).toBeTruthy();
  });

  it('allows adding photos to questions', () => {
    const {getAllByText} = render(
      <Provider store={store}>
        <AuditExecutionScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Press add photo button
    fireEvent.press(getAllByText('Add Photo')[0]);

    // Check if the camera action was triggered
    const actions = store.getActions();
    expect(actions[0].type).toBe('audits/startPhotoCapture');
    expect(actions[0].payload.questionId).toBe('q1');
  });
});
