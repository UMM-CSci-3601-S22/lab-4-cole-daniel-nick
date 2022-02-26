import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  todo: Todo;

  // not sure if this owner is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  addTodoValidationMessages = {
    owner: [
      { type: 'required', message: 'Owner is required' },
      { type: 'minlength', message: 'Owner must be at least 2 characters long' },
      { type: 'maxlength', message: 'Owner cannot be more than 50 characters long' },
    ],

    category: [
      { type: 'required', message: 'Category is required' },
      { type: 'minlength', message: 'Category must be at least 2 characters long' },
      { type: 'maxlength', message: 'Category cannot be more than 50 characters long' },
    ],

    body: [
      { type: 'required', message: 'body is required' },
      { type: 'minlength', message: 'body must be at least 2 characters long' },
      { type: 'maxlength', message: 'body cannot be more than 500 characters long' },
    ],

    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'pattern', message: 'Status must be true or false' },
    ]
  };

  constructor(private fb: FormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {

    // add todo form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long owners. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(300),
      ])),

      // We don't care much about what is in the company field, so we just add it here as part of the form
      // without any particular validation.
      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ])),

      // how to pattern check true/false
      status: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe(newID => {
      this.snackBar.open('Added Todo ' + this.addTodoForm.value.owner, null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the todo', 'OK', {
        duration: 5000,
      });
    });
  }

}
