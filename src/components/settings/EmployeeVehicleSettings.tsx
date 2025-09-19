import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Users, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
}

interface Vehicle {
  id: string;
  type: string;
  registrationNumber: string;
  model: string;
}

const EMPLOYEES_STORAGE_KEY = 'company-employees';
const VEHICLES_STORAGE_KEY = 'company-vehicles';

export function EmployeeVehicleSettings() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    phone: ''
  });
  const [vehicleForm, setVehicleForm] = useState({
    type: '',
    registrationNumber: '',
    model: ''
  });

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

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(newEmployees));
  };

  const saveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(newVehicles));
  };

  const handleAddEmployee = () => {
    if (!employeeForm.name) {
      toast({
        title: "Error",
        description: "Employee name is required",
        variant: "destructive"
      });
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...employeeForm
    };

    saveEmployees([...employees, newEmployee]);
    setEmployeeForm({ name: '', position: '', phone: '' });
    
    toast({
      title: "Employee Added",
      description: `${newEmployee.name} has been added successfully`
    });
  };

  const handleRemoveEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    saveEmployees(updatedEmployees);
    
    toast({
      title: "Employee Removed",
      description: "Employee has been removed successfully"
    });
  };

  const handleAddVehicle = () => {
    if (!vehicleForm.type || !vehicleForm.registrationNumber) {
      toast({
        title: "Error",
        description: "Vehicle type and registration number are required",
        variant: "destructive"
      });
      return;
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...vehicleForm
    };

    saveVehicles([...vehicles, newVehicle]);
    setVehicleForm({ type: '', registrationNumber: '', model: '' });
    
    toast({
      title: "Vehicle Added",
      description: `${newVehicle.type} - ${newVehicle.registrationNumber} has been added successfully`
    });
  };

  const handleRemoveVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
    saveVehicles(updatedVehicles);
    
    toast({
      title: "Vehicle Removed",
      description: "Vehicle has been removed successfully"
    });
  };

  return (
    <div className="space-y-6">
      {/* Employees Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Employee Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="employeeName">Employee Name *</Label>
              <Input
                id="employeeName"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <Label htmlFor="employeePosition">Position</Label>
              <Input
                id="employeePosition"
                value={employeeForm.position}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Enter position"
              />
            </div>
            <div>
              <Label htmlFor="employeePhone">Phone</Label>
              <Input
                id="employeePhone"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <Button onClick={handleAddEmployee} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>

          {/* Employees List */}
          {employees.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Current Employees</h4>
              <div className="space-y-2">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      {employee.position && <div className="text-sm text-muted-foreground">{employee.position}</div>}
                      {employee.phone && <div className="text-sm text-muted-foreground">{employee.phone}</div>}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveEmployee(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicles Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Vehicle Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Input
                id="vehicleType"
                value={vehicleForm.type}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, type: e.target.value }))}
                placeholder="e.g., Toyota Hilux"
              />
            </div>
            <div>
              <Label htmlFor="vehicleReg">Registration Number *</Label>
              <Input
                id="vehicleReg"
                value={vehicleForm.registrationNumber}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, registrationNumber: e.target.value }))}
                placeholder="e.g., ABC-123D"
              />
            </div>
            <div>
              <Label htmlFor="vehicleModel">Model</Label>
              <Input
                id="vehicleModel"
                value={vehicleForm.model}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Enter model details"
              />
            </div>
          </div>
          <Button onClick={handleAddVehicle} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>

          {/* Vehicles List */}
          {vehicles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Current Vehicles</h4>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{vehicle.type} - {vehicle.registrationNumber}</div>
                      {vehicle.model && <div className="text-sm text-muted-foreground">{vehicle.model}</div>}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}