import { useState, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  type: string;
  registrationNumber: string;
  model: string;
}

const EMPLOYEES_STORAGE_KEY = 'company-employees';
const VEHICLES_STORAGE_KEY = 'company-vehicles';

export function useEmployeeVehicleSettings() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (error) {
        console.error('Failed to parse employees:', error);
      }
    }

    // Load vehicles from localStorage
    const savedVehicles = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (savedVehicles) {
      try {
        setVehicles(JSON.parse(savedVehicles));
      } catch (error) {
        console.error('Failed to parse vehicles:', error);
      }
    }
  }, []);

  return {
    employees,
    vehicles
  };
}