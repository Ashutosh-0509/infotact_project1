import { useState } from 'react';
import { Plus, Search, Filter, UserCheck, UserX, Edit, Trash2, Eye, Calendar, DollarSign, Briefcase, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable, Column, Action } from '@/components/DataTable';
import { EmployeeForm } from '@/components/Forms';
import { Employee, formatDate, formatCurrency, UserRole } from '@/lib/index';
import { mockEmployees } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  salary?: number;
  hireDate: Date;
  address?: string;
  emergencyContact?: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone.includes(searchQuery);
    
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && employee.isActive) ||
      (statusFilter === 'inactive' && !employee.isActive);

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setEmployees(employees.map(e => 
      e.id === id ? { ...e, isActive: !e.isActive } : e
    ));
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (selectedEmployee) {
      setEmployees(employees.map(e => 
        e.id === selectedEmployee.id 
          ? { ...e, ...data, isActive: true }
          : e
      ));
    } else {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        ...data,
        isActive: true,
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsFormOpen(false);
    setSelectedEmployee(undefined);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'default';
      case 'Manager': return 'secondary';
      case 'Staff': return 'outline';
      default: return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Employee',
      render: (employee: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-sm text-muted-foreground">{employee.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (employee: Employee) => (
        <Badge variant={getRoleBadgeVariant(employee.role)}>
          {employee.role}
        </Badge>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (employee: Employee) => (
        <span className="text-sm">{employee.department || 'N/A'}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (employee: Employee) => (
        <span className="text-sm">{employee.phone}</span>
      ),
    },
    {
      key: 'hireDate',
      label: 'Hire Date',
      render: (employee: Employee) => (
        <span className="text-sm">{formatDate(employee.hireDate)}</span>
      ),
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (employee: Employee) => (
        <span className="text-sm font-medium">
          {employee.salary ? formatCurrency(employee.salary) : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (employee: Employee) => (
        <Badge variant={employee.isActive ? 'default' : 'secondary'}>
          {employee.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const actions: Action[] = [
    {
      label: 'View Details',
      onClick: (employee: Employee) => handleViewEmployee(employee),
    },
    {
      label: 'Edit',
      onClick: (employee: Employee) => handleEditEmployee(employee),
    },
    {
      label: 'Toggle Status',
      onClick: (employee: Employee) => handleToggleStatus(employee.id),
    },
    {
      label: 'Delete',
      onClick: (employee: Employee) => handleDeleteEmployee(employee.id),
      variant: 'destructive',
    },
  ];

  const activeEmployees = employees.filter(e => e.isActive).length;
  const totalSalary = employees
    .filter(e => e.isActive && e.salary)
    .reduce((sum, e) => sum + (e.salary || 0), 0);
  const adminCount = employees.filter(e => e.role === 'Admin' && e.isActive).length;
  const managerCount = employees.filter(e => e.role === 'Manager' && e.isActive).length;
  const staffCount = employees.filter(e => e.role === 'Staff' && e.isActive).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their roles
            </p>
          </div>
          <Button onClick={handleAddEmployee} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Employee
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeEmployees} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSalary)}</div>
              <p className="text-xs text-muted-foreground">
                Monthly salary expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role Distribution</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admin:</span>
                  <span className="font-medium">{adminCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="font-medium">{managerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staff:</span>
                  <span className="font-medium">{staffCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>Search and filter employees</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept || ''}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredEmployees.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No employees found matching your filters.
                  </AlertDescription>
                </Alert>
              ) : viewMode === 'table' ? (
                <DataTable
                  columns={columns}
                  data={filteredEmployees}
                  onRowClick={handleViewEmployee}
                  actions={actions}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEmployees.map(employee => (
                    <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{employee.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {employee.role}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={employee.isActive ? 'default' : 'secondary'}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{employee.phone}</span>
                          </div>
                          {employee.department && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Briefcase className="h-4 w-4" />
                              <span>{employee.department}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Hired {formatDate(employee.hireDate)}</span>
                          </div>
                          {employee.salary && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">{formatCurrency(employee.salary)}</span>
                            </div>
                          )}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewEmployee(employee)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
              <DialogDescription>
                {selectedEmployee 
                  ? 'Update employee information and role assignment'
                  : 'Enter employee details to add them to your team'
                }
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm
              employee={selectedEmployee}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedEmployee(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                Complete information and activity logs
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                        {getInitials(selectedEmployee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedEmployee.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRoleBadgeVariant(selectedEmployee.role)}>
                          {selectedEmployee.role}
                        </Badge>
                        <Badge variant={selectedEmployee.isActive ? 'default' : 'secondary'}>
                          {selectedEmployee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.phone}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.department || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(selectedEmployee.hireDate, 'long')}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Salary</label>
                        <div className="flex items-center gap-2 mt-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedEmployee.salary ? formatCurrency(selectedEmployee.salary) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.emergencyContact || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedEmployee.address && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <div className="flex items-start gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{selectedEmployee.address}</span>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="attendance" className="space-y-4">
                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      Attendance tracking feature coming soon. This will show check-in/check-out times, leave requests, and attendance history.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
                <TabsContent value="performance" className="space-y-4">
                  <Alert>
                    <Briefcase className="h-4 w-4" />
                    <AlertDescription>
                      Performance metrics feature coming soon. This will display sales performance, customer ratings, and productivity metrics.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
