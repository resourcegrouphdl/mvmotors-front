export interface BaseProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  userType: UserType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  storeIds?: string[];
  // Flag para controlar primer login
  isFirstLogin: boolean;
  lastPasswordChange?: Date;
}

export enum UserType {
  STORE = 'store',
  VENDOR = 'vendor'
}

export abstract class BaseUser implements BaseProfile {
  uid!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  documentType!: string;
  documentNumber!: string;
  userType!: UserType;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy?: string;
  storeIds?: string[];
  isFirstLogin!: boolean;
  lastPasswordChange?: Date;
}

export class StoreUser extends BaseUser {
  storeInfo!: {
        storeId: string;
        storeName: string;
        storeCode: string;
        address: any; // Tu interface Address
        maxInventory: number;
        managedBy?: string;
    };
}

export class VendorUser extends BaseUser {
  vendorInfo!: {
    employeeId: string;
    commissionRate: number;
    territory: string;
    hireDate: Date;
    managerId?: string;
  };
  storeAssignments!: {
    storeId: string;
    storeName: string;
    assignedAt: Date;
    assignedBy: string;
    isActive: boolean;
    permissions: string[];
  }[];
}