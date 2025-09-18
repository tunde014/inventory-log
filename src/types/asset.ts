export interface Asset {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitOfMeasurement: string;
  category: 'dewatering' | 'waterproofing';
  type: 'consumable' | 'non-consumable' | 'tools' | 'equipment';
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Waybill {
  id: string;
  items: WaybillItem[];
  purpose: string;
  driverName: string;
  vehicle: string;
  issueDate: Date;
  expectedReturnDate?: Date;
  status: 'outstanding' | 'return_initiated' | 'return_completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface WaybillItem {
  assetId: string;
  assetName: string;
  quantity: number;
  returnedQuantity: number;
  status: 'outstanding' | 'return_initiated' | 'return_completed' | 'lost' | 'damaged';
}

export interface QuickCheckout {
  id: string;
  assetId: string;
  assetName: string;
  quantity: number;
  employee: string;
  checkoutDate: Date;
  expectedReturnDays: number;
  status: 'outstanding' | 'return_completed' | 'lost' | 'damaged';
}

export interface ReturnBill {
  id: string;
  waybillId: string;
  items: ReturnItem[];
  returnDate: Date;
  receivedBy: string;
  condition: 'good' | 'damaged' | 'missing';
  notes?: string;
  status: 'initiated' | 'completed';
}

export interface ReturnItem {
  assetId: string;
  assetName: string;
  quantity: number;
  condition: 'good' | 'damaged' | 'missing';
}