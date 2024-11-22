import { v4 as uuidv4 } from 'uuid';
import { MasterDataType, ImportResult } from '../types/master';

const MASTER_DATA_KEY = 'master_data';

function getStoredData() {
  const stored = localStorage.getItem(MASTER_DATA_KEY);
  return stored ? JSON.parse(stored) : {
    centers: [],
    families: [],
    cycles: [],
    courses: [],
    departments: []
  };
}

function saveStoredData(data: any) {
  localStorage.setItem(MASTER_DATA_KEY, JSON.stringify(data));
}

export const createEntity = async (type: MasterDataType, data: any): Promise<string> => {
  const allData = getStoredData();
  const id = uuidv4();
  
  allData[type].push({
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  saveStoredData(allData);
  return id;
};

export const updateEntity = async (type: MasterDataType, id: string, data: any): Promise<void> => {
  const allData = getStoredData();
  
  allData[type] = allData[type].map((entity: any) =>
    entity.id === id ? {
      ...entity,
      ...data,
      updatedAt: new Date().toISOString()
    } : entity
  );

  saveStoredData(allData);
};

export const deleteEntity = async (type: MasterDataType, id: string): Promise<void> => {
  const allData = getStoredData();
  allData[type] = allData[type].filter((entity: any) => entity.id !== id);
  saveStoredData(allData);
};

export const getEntity = async (type: MasterDataType, id: string): Promise<any> => {
  const allData = getStoredData();
  return allData[type].find((entity: any) => entity.id === id);
};

export const listEntities = async (type: MasterDataType): Promise<any[]> => {
  const allData = getStoredData();
  return allData[type];
};

export const generateTemplate = (type: MasterDataType): Blob => {
  const columns = getColumns(type);
  const workbook = {
    SheetNames: ['Template'],
    Sheets: {
      Template: {
        '!ref': `A1:${String.fromCharCode(65 + columns.length - 1)}1`,
        ...columns.reduce((acc, col, idx) => {
          acc[`${String.fromCharCode(65 + idx)}1`] = { v: col };
          return acc;
        }, {})
      }
    }
  };

  // Convert to blob
  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  const wbout = window.XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  return new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const importData = async (
  type: MasterDataType,
  file: File,
  userId: string,
  userName: string
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    totalRows: 0,
    successCount: 0,
    errorCount: 0,
    errors: []
  };

  try {
    const reader = new FileReader();
    const data = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    const workbook = window.XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Skip header row
    const dataRows = rows.slice(1);
    result.totalRows = dataRows.length;

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const row = dataRows[i];
        const columns = getColumns(type);
        const rowData = columns.reduce((acc, field, index) => {
          acc[field] = row[index];
          return acc;
        }, {} as any);

        await createEntity(type, {
          ...rowData,
          active: true,
          createdBy: userId,
          createdByName: userName
        });
        
        result.successCount++;
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          row: i + 2,
          field: 'unknown',
          message: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }

    result.success = result.errorCount === 0;
  } catch (error) {
    throw new Error('Error al procesar el archivo');
  }

  return result;
};

function getColumns(type: MasterDataType): string[] {
  switch (type) {
    case 'centers':
      return ['code', 'name', 'address', 'city', 'province', 'phone', 'email'];
    case 'families':
      return ['code', 'name', 'description'];
    case 'cycles':
      return ['code', 'name', 'familyId', 'level', 'duration', 'description'];
    case 'courses':
      return ['code', 'name', 'cycleId', 'year'];
    case 'departments':
      return ['code', 'name', 'description', 'familyId', 'centerId', 'head', 'email', 'phone'];
    default:
      return [];
  }
}