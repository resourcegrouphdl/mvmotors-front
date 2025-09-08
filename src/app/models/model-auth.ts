import { Timestamp } from "@angular/fire/firestore";

export interface BaseProfile {
   uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
  userType: UserType;
  userCategory: UserCategory;
  isActive: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  createdBy?: string;
  storeIds?: string[];
  isFirstLogin?: boolean;
  lastPasswordChange?: Date | Timestamp;
  avatar?: string;
 
}

export enum UserType {
  STORE = 'tienda',
  VENDOR = 'vendedor'
}

export abstract class BaseUser implements BaseProfile {
   uid!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  documentType!: DocumentType;
  documentNumber!: string;
  userType!: UserType;
  userCategory!: UserCategory;
  isActive!: boolean;
  createdAt!: Date | Timestamp;
  updatedAt!: Date | Timestamp;
  createdBy?: string;
  storeIds?: string[];
  isFirstLogin?: boolean;
  lastPasswordChange?: Date | Timestamp;
  avatar?: string;
  
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
export enum UserCategory {
  INTERNO = 'interno',     // Usuarios de la organización
  EXTERNO = 'externo'      // Tiendas y vendedores afiliados
}
export enum DocumentType {
  DNI = 'dni',
  RUC = 'ruc',
  CARNET_EXTRANJERIA = 'carnet_extranjeria',
  PASAPORTE = 'pasaporte'
}

export interface TiendaProfile extends BaseProfile {
  businessName: string;           // Nombre comercial
  businessCategory: string;       // Categoría del negocio
  address: string;                // Dirección física
  city: string;                   // Ciudad
  district: string;               // Distrito
}
export interface VendedorProfile extends BaseProfile {
  tiendaId: string;               // ID de la tienda a la que pertenece
  employeeId?: string;            // ID de empleado en la tienda
  position: string;               // Cargo/posición
  vendedorStatus: VendedorStatus; // Estado del vendedor
}

export enum VendedorStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido'
}