import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeModel } from './employee-dashboard.model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
formValue!: FormGroup;
showAdd!: boolean;
showUpdate!: boolean;

employeeData!: any;
employeeModelObject: EmployeeModel = new EmployeeModel();

constructor(public formbuilder: FormBuilder, private api: ApiService) {}

ngOnInit(): void {
  // Initialize the form group with empty form controls
  this.formValue = this.formbuilder.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    mobile: [''],
    salary: [''],
  });

  // Fetch all employees when the component initializes
  this.getAllEmployee();
}

// Function to show the Add Employee form
clickAddEmploye() {
  // Reset the form values and set flags to show the Add form
  this.formValue.reset();
  this.showAdd = true;
  this.showUpdate = false;
}

// Function to post employee details to the server
postEmployeeDetails() {
  // Populate the employee model object with form values
  this.employeeModelObject.firstName = this.formValue.value.firstName;
  this.employeeModelObject.lastName = this.formValue.value.lastName;
  this.employeeModelObject.email = this.formValue.value.email;
  this.employeeModelObject.mobile = this.formValue.value.mobile;
  this.employeeModelObject.salary = this.formValue.value.salary;

  // Call the API to post employee details
  this.api.postEmploye(this.employeeModelObject).subscribe(
    (res) => {
      console.log(res);
      alert('Employee Added Successfully');

      // Close the modal dialog and reset the form
      let id = document.getElementById('cancel');
      id?.click();
      this.formValue.reset();

      // Fetch all employees again to update the list
      this.getAllEmployee();
    },
    (err) => {
      alert('Something Went Wrong');
    }
  );
}

// Function to fetch all employees from the server
getAllEmployee() {
  this.api.getEmployee().subscribe((res) => {
    // Store the employee data in the component
    this.employeeData = res;
  });
}

// Function to delete an employee
deleteEmployee(row: any) {
  console.log('row...', row);
  this.api.deleteEmployee(row.id).subscribe((res) => {
    alert('Employee Deleted');

    // Fetch all employees again after deleting one
    this.getAllEmployee();
  });
}

// Function to edit an employee's details
onEdit(row: any) {
  // Set flags to show the Update form and populate the form fields with employee data
  this.showAdd = false;
  this.showUpdate = true;
  this.employeeModelObject.id = row.id;
  this.formValue.controls['firstName'].setValue(row.firstName);
  this.formValue.controls['lastName'].setValue(row.lastName);
  this.formValue.controls['email'].setValue(row.email);
  this.formValue.controls['mobile'].setValue(row.mobile);
  this.formValue.controls['salary'].setValue(row.salary);
}

// Function to update employee details
updateEmployeeDetails() {
  // Populate the employee model object with form values
  this.employeeModelObject.firstName = this.formValue.value.firstName;
  this.employeeModelObject.lastName = this.formValue.value.lastName;
  this.employeeModelObject.email = this.formValue.value.email;
  this.employeeModelObject.mobile = this.formValue.value.mobile;
  this.employeeModelObject.salary = this.formValue.value.salary;

  // Call the API to update employee details
  this.api
    .updateEmployee(this.employeeModelObject, this.employeeModelObject.id)
    .subscribe((res) => {
      alert('Updated Successfully');

      // Close the modal dialog and reset the form
      let id = document.getElementById('cancel');
      id?.click();
      this.formValue.reset();

      // Fetch all employees again to update the list
      this.getAllEmployee();
    });
}

}
