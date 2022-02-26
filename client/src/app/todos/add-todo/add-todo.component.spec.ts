import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from '../todo.service';

describe('AddTodoComponent', () => {
  let addTodoComponent: AddTodoComponent;
  let addTodoForm: FormGroup;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddTodoComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixture.componentInstance;
    addTodoComponent.ngOnInit();
    fixture.detectChanges();
    addTodoForm = addTodoComponent.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addTodoComponent).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  describe('The owner field', () => {
    let ownerControl: AbstractControl;

    beforeEach(() => {
      ownerControl = addTodoComponent.addTodoForm.controls.owner;
    });

    it('should not allow empty owner', () => {
      ownerControl.setValue('');
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should be fine with "Chris Smith"', () => {
      ownerControl.setValue('Chris Smith');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should fail on single character owners', () => {
      ownerControl.setValue('x');
      expect(ownerControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
      expect(ownerControl.hasError('minlength')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like owner lengths just
    // because there are people with really long owners.
    it('should fail on really long owners', () => {
      ownerControl.setValue('x'.repeat(100));
      expect(ownerControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(ownerControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the owner', () => {
      ownerControl.setValue('Bad2Th3B0ne');
      expect(ownerControl.valid).toBeTruthy();
    });

  });

  describe('The category field', () => {
    let categoryControl: AbstractControl;

    beforeEach(() => {
      categoryControl = addTodoComponent.addTodoForm.controls.category;
    });

    it('should not allow empty categories', () => {
      categoryControl.setValue('');
      expect(categoryControl.valid).toBeFalsy();
    });

    it('should accept on single character category', () => {
      categoryControl.setValue('x');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should be fine with "homework"', () => {
      categoryControl.setValue('homework');
      expect(categoryControl.valid).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like category lengths just
    // because there are people with really long categories.
    it('should fail on really long category', () => {
      categoryControl.setValue('x'.repeat(100));
      expect(categoryControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(categoryControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the category', () => {
      categoryControl.setValue('Bad2Th3B0ne');
      expect(categoryControl.valid).toBeTruthy();
    });
  });

  describe('The body field', () => {
    let bodyControl: AbstractControl;

    beforeEach(() => {
      bodyControl = addTodoComponent.addTodoForm.controls.body;
    });

    it('should not allow empty body', () => {
      bodyControl.setValue('');
      expect(bodyControl.valid).toBeFalsy();
    });

    it('should accept on single character body', () => {
      bodyControl.setValue('x');
      expect(bodyControl.valid).toBeTruthy();
    });

    it('should be fine with "Do my homework"', () => {
      bodyControl.setValue('Do my homework');
      expect(bodyControl.valid).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like category lengths just
    // because there are people with really long categories.
    it('should fail on really long body', () => {
      bodyControl.setValue('x'.repeat(501));
      expect(bodyControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(bodyControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the body', () => {
      bodyControl.setValue('Bad2Th3B0ne');
      expect(bodyControl.valid).toBeTruthy();
    });
  });

  describe('The status field', () => {
    let statusControl: AbstractControl;

    beforeEach(() => {
      statusControl = addTodoForm.controls.status;
    });

    it('should not allow empty values', () => {
      statusControl.setValue('');
      expect(statusControl.valid).toBeFalsy();
      expect(statusControl.hasError('required')).toBeTruthy();
    });

    it('should allow "complete"', () => {
      statusControl.setValue('true');
      expect(statusControl.valid).toBeTruthy();
    });

    it('should allow "incomplete"', () => {
      statusControl.setValue('false');
      expect(statusControl.valid).toBeTruthy();
    });

    it('should not allow "Supreme Overlord"', () => {
      statusControl.setValue('Supreme Overlord');
      expect(statusControl.valid).toBeFalsy();
    });
  });
});
