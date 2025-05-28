import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export const useNavigation = () => {
  const navigation = useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return {
    navigation,
    navigateToAuth: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    },
    navigateToMain: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    },
    navigateToHome: () => navigation.navigate('Main', { screen: 'Home' }),
    navigateToCreateAudit: () => navigation.navigate('Main', { screen: 'CreateAudit' }),
    navigateToAuditDetails: (id: string) =>
      navigation.navigate('Main', { screen: 'AuditDetails', params: { id } }),
    navigateToAddFinding: (auditId: string) =>
      navigation.navigate('Main', { screen: 'AddFinding', params: { auditId } }),
    navigateToProfile: () => navigation.navigate('Main', { screen: 'Profile' }),
    navigateToSettings: () => navigation.navigate('Main', { screen: 'Settings' }),
    goBack: () => navigation.goBack(),
  };
}; 