import { SetMetadata } from "@nestjs/common";

export enum Role {
    Customer = 'Customer',
    Admin = 'Admin',
    Vendor = 'Vendor'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)