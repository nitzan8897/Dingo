/**
 * Legal specialty types
 * Shared across the entire Dingo platform
 */

export enum Specialty {
  CRIMINAL = 'CRIMINAL',
  CIVIL = 'CIVIL',
  CORPORATE = 'CORPORATE',
  FAMILY = 'FAMILY',
  LABOR = 'LABOR',
  TAX = 'TAX',
  IMMIGRATION = 'IMMIGRATION',
  REAL_ESTATE = 'REAL_ESTATE',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
}

export type SpecialtyValue = `${Specialty}`;
