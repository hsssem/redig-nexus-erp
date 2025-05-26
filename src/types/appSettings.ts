
export interface DeletedItem {
  id: string;
  name: string;
  type: 'customer' | 'task' | 'meeting' | 'invoice' | 'project' | 'team' | 'lead' | 'payment';
  data: any; // Store the original data for restoration
  deletedAt: string;
}

export interface TaxConfig {
  enabled: boolean;
  rate: number;
  name: string;
}

export interface AppSettingsContextType {
  deletedItems: DeletedItem[];
  addToTrash: (item: DeletedItem) => void;
  restoreItem: (id: string) => Promise<boolean>;
  clearTrash: () => void;
  permanentlyDelete: (id: string) => void;
  currencySymbol: string;
  taxConfig: TaxConfig;
  loading: boolean;
  addDeletedItem: (item: DeletedItem) => void;
}
