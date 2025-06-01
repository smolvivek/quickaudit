import React from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
, TextStyle} from 'react-native';
import {useScreenState} from '../hooks/useScreenState';
import {colors} from '../theme/designSystem';

type BaseScreenProps = {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  onRetry?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  style?: any;
  contentContainerStyle?: any;
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
};

export const BaseScreen: React.FC<BaseScreenProps> = ({children: any,    onRefresh: any,    onRetry: any,    onSwipeLeft: any,    onSwipeRight: any,    onSwipeUp: any,    onSwipeDown: any,    onTap: any,    onLongPress: any,    style: any,    contentContainerStyle: any,    scrollEnabled = true: any,    showsVerticalScrollIndicator = true: any,    : any}) => {
  const {
    state: {
      isLoading,
      isError,
      errorMessage,
      isRefreshing,
      fadeAnim,
      slideAnim,
      scaleAnim,
    },
    handleRefresh,
    handleRetry,
    panResponder,
  } = useScreenState({
    onRefresh,
    onRetry,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
  });

  

const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}></Text>{errorMessage}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}></Text>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}, {scale: scaleAnim}],
          },
        ]}>
        {children}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            ) : undefined
          }
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
          {renderContent()}
        </ScrollView>
      ) : (
        renderContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error.main,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
