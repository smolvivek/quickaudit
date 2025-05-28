import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUDITS: '@quickaudit/audits',
  USER: '@quickaudit/user',
  SETTINGS: '@quickaudit/settings',
};

export const storage = {
  // Audits
  async getAudits() {
    try {
      const audits = await AsyncStorage.getItem(STORAGE_KEYS.AUDITS);
      return audits ? JSON.parse(audits) : [];
    } catch (error) {
      console.error('Error getting audits:', error);
      return [];
    }
  },

  async saveAudits(audits: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(audits));
    } catch (error) {
      console.error('Error saving audits:', error);
    }
  },

  async addAudit(audit: any) {
    try {
      const audits = await this.getAudits();
      audits.push(audit);
      await this.saveAudits(audits);
    } catch (error) {
      console.error('Error adding audit:', error);
    }
  },

  async updateAudit(updatedAudit: any) {
    try {
      const audits = await this.getAudits();
      const index = audits.findIndex((a: any) => a.id === updatedAudit.id);
      if (index !== -1) {
        audits[index] = updatedAudit;
        await this.saveAudits(audits);
      }
    } catch (error) {
      console.error('Error updating audit:', error);
    }
  },

  async deleteAudit(auditId: string) {
    try {
      const audits = await this.getAudits();
      const filteredAudits = audits.filter((a: any) => a.id !== auditId);
      await this.saveAudits(filteredAudits);
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  },

  // User
  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async saveUser(user: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async clearUser() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  },

  // Settings
  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  async saveSettings(settings: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Clear all data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUDITS,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
}; 