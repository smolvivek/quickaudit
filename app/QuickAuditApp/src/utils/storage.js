import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUDITS: '@QuickAudit:audits',
  FINDINGS: '@QuickAudit:findings',
};

export const saveAudit = async audit => {
  try {
    const existingAudits = await getAudits();
    const updatedAudits = [...existingAudits, audit];
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUDITS,
      JSON.stringify(updatedAudits),
    );
    return audit;
  } catch (error) {
    console.error('Error saving audit:', error);
    throw error;
  }
};

export const getAudits = async () => {
  try {
    const audits = await AsyncStorage.getItem(STORAGE_KEYS.AUDITS);
    return audits ? JSON.parse(audits) : [];
  } catch (error) {
    console.error('Error getting audits:', error);
    return [];
  }
};

export const getAudit = async auditId => {
  try {
    const audits = await getAudits();
    return audits.find(audit => audit.id === auditId);
  } catch (error) {
    console.error('Error getting audit:', error);
    return null;
  }
};

export const updateAudit = async updatedAudit => {
  try {
    const audits = await getAudits();
    const index = audits.findIndex(audit => audit.id === updatedAudit.id);
    if (index !== -1) {
      audits[index] = updatedAudit;
      await AsyncStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(audits));
      return updatedAudit;
    }
    return null;
  } catch (error) {
    console.error('Error updating audit:', error);
    throw error;
  }
};

export const saveFinding = async (auditId, finding) => {
  try {
    const audit = await getAudit(auditId);
    if (!audit) {
      throw new Error('Audit not found');
    }

    const findings = audit.findings || [];
    const updatedFindings = [...findings, finding];
    const updatedAudit = {
      ...audit,
      findings: updatedFindings,
    };

    await updateAudit(updatedAudit);
    return finding;
  } catch (error) {
    console.error('Error saving finding:', error);
    throw error;
  }
};

export const deleteAudit = async auditId => {
  try {
    const audits = await getAudits();
    const updatedAudits = audits.filter(audit => audit.id !== auditId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUDITS,
      JSON.stringify(updatedAudits),
    );
  } catch (error) {
    console.error('Error deleting audit:', error);
    throw error;
  }
};
