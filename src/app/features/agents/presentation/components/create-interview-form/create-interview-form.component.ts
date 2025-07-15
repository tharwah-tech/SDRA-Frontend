import { selectInterviewsLoading } from './../../store/interviews/interviews.selectors';
import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GenderType } from '../../../../../core/enums/gender-type.enum';
import { JobType } from '../../../../../core/enums/job-type.enum';
import { Store } from '@ngrx/store';
import { MatOptionModule } from '@angular/material/core';
import { CreateInteviewEntity } from '../../../domain/entities/create-interview.entity';
import { Observable } from 'rxjs';

type CandidateInformationFormGroup = FormGroup<{
  candidateFullName: FormControl<string>;
  candidateEmail: FormControl<string>;
  candidateCountryCode: FormControl<string>;
  candidatePhone: FormControl<string>;
  candidateGender: FormControl<GenderType>;
}>;
type JobInformationFormGroup = FormGroup<{
  jobTitle: FormControl<string>;
  jobDescription: FormControl<string>;
  jobType: FormControl<JobType>;
  jobRequirements: FormControl<string>;
}>;
type InterviewQuestionFormGroup = FormGroup<{
  question: FormControl<string>;
}>;
type InterviewFormGroup = FormGroup<{
  CandidateInformationFormGroup: CandidateInformationFormGroup;
  JobInformationFormGroup: JobInformationFormGroup;
  InterviewQuestionsFormArray: FormArray<InterviewQuestionFormGroup>;
}>;

@Component({
  selector: 'app-create-interview-form',
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-interview-form.component.html',
  styleUrl: './create-interview-form.component.scss',
})
export class CreateInterviewFormComponent {
  onSubmitData = output<CreateInteviewEntity>();
  form: InterviewFormGroup;
  maxTitle = 60;
  maxDescription = 512;
  GenderType = GenderType;
  GenderTypeKeys = Object.keys(GenderType); // Get enum keys
  GenderTypeValues = Object.values(GenderType); // Get enum values
  JobType = JobType;
  JobTypeKeys = Object.keys(JobType); // Get enum keys
  JobTypeValues = Object.values(JobType); // Get enum values
  loading$: Observable<boolean>;
  countryPhoneCodes = [
    { code: '+966', name: 'Saudi Arabia', label: 'SA' },
    { code: '+20', name: 'Egypt', label: 'EG' },
    { code: '+1', name: 'United States', label: 'US' },
    { code: '+44', name: 'United Kingdom', label: 'UK' },
    { code: '+91', name: 'India', label: 'IN' },
    { code: '+61', name: 'Australia', label: 'AU' },
    { code: '+81', name: 'Japan', label: 'JP' },
    { code: '+49', name: 'Germany', label: 'DE' },
    { code: '+33', name: 'France', label: 'FR' },
    { code: '+39', name: 'Italy', label: 'IT' },
    { code: '+34', name: 'Spain', label: 'ES' },
    { code: '+7', name: 'Russia', label: 'RU' },
    { code: '+86', name: 'China', label: 'CN' },
    { code: '+55', name: 'Brazil', label: 'BR' },
    { code: '+27', name: 'South Africa', label: 'ZA' },
    { code: '+82', name: 'South Korea', label: 'KR' },
    { code: '+66', name: 'Thailand', label: 'TH' },
    { code: '+60', name: 'Malaysia', label: 'MY' },
    { code: '+65', name: 'Singapore', label: 'SG' },
    { code: '+63', name: 'Philippines', label: 'PH' },
    { code: '+62', name: 'Indonesia', label: 'ID' },
    { code: '+90', name: 'Turkey', label: 'TR' },
    { code: '+971', name: 'United Arab Emirates', label: 'AE' },
    { code: '+234', name: 'Nigeria', label: 'NG' },
    { code: '+254', name: 'Kenya', label: 'KE' },
    { code: '+351', name: 'Portugal', label: 'PT' },
    { code: '+31', name: 'Netherlands', label: 'NL' },
    { code: '+46', name: 'Sweden', label: 'SE' },
    { code: '+41', name: 'Switzerland', label: 'CH' },
    { code: '+32', name: 'Belgium', label: 'BE' },
    { code: '+48', name: 'Poland', label: 'PL' },
    { code: '+351', name: 'Portugal', label: 'PT' },
    { code: '+420', name: 'Czech Republic', label: 'CZ' },
    { code: '+351', name: 'Portugal', label: 'PT' },
    { code: '+358', name: 'Finland', label: 'FI' },
    { code: '+358', name: 'Finland', label: 'FI' },
    { code: '+30', name: 'Greece', label: 'GR' },
    { code: '+36', name: 'Hungary', label: 'HU' },
    { code: '+351', name: 'Portugal', label: 'PT' },
  ];
  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectInterviewsLoading);
    this.form = fb.group({
      CandidateInformationFormGroup: fb.group({
        candidateFullName: fb.control('', {
          validators: [
            Validators.required,
            Validators.maxLength(this.maxTitle),
          ],
        }),
        candidateEmail: fb.control('', {
          validators: [Validators.required, Validators.email],
        }),
        candidateCountryCode: fb.control('+966', {
          validators: [
            Validators.required,
            Validators.pattern('^\\+[1-9]\\d{0,3}$'),
          ],
        }),
        candidatePhone: fb.control('', {
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]\\d{6,11}$'),
          ],
        }),
        candidateGender: fb.control<GenderType>('' as GenderType, {
          validators: [Validators.required],
        }),
      }),
      JobInformationFormGroup: fb.group({
        jobTitle: fb.control('', {
          validators: [
            Validators.required,
            Validators.maxLength(this.maxTitle),
          ],
        }),
        jobDescription: fb.control('', {
          validators: [
            Validators.required,
            Validators.maxLength(this.maxDescription),
          ],
        }),
        jobType: fb.control<JobType>('' as JobType, {
          validators: [Validators.required],
        }),
        jobRequirements: fb.control('', {
          validators: [],
        }),
      }),
      InterviewQuestionsFormArray: fb.array<InterviewQuestionFormGroup>([]),
    });
  }

  generateInterviewQuestionGroup(): InterviewQuestionFormGroup {
    return this.fb.group({
      question: this.fb.control('', { validators: [Validators.required] }),
    });
  }
  addInterviewQuestion() {
    const questionsArray = this.form.controls.InterviewQuestionsFormArray;
    questionsArray.push(this.generateInterviewQuestionGroup());
  }
  removeInterviewQuestion(index: number) {
    const questionsArray = this.form.controls.InterviewQuestionsFormArray;
    if (index >= 0 && index < questionsArray.length) {
      questionsArray.removeAt(index);
    }
  }
  // onSubmit() {
  //   if (this.form.valid) {
  //     const formData = this.form.getRawValue(); // or this.form.value

  //     // Convert to your interface
  //     const interviewData = {
  //       candidate_info: {
  //         full_name:
  //           formData.CandidateInformationFormGroup?.candidateFullName || '',
  //         email: formData.CandidateInformationFormGroup?.candidateEmail || '',
  //         phone: formData.CandidateInformationFormGroup?.candidatePhone || '',
  //         gender: formData.CandidateInformationFormGroup?.candidateGender || '',
  //       },
  //       job_info: {
  //         title: formData.JobInformationFormGroup?.jobTitle || '',
  //         contract_type: formData.JobInformationFormGroup?.jobType || '',
  //         job_description:
  //           formData.JobInformationFormGroup?.jobDescription || '',
  //         job_requirements:
  //           formData.JobInformationFormGroup?.jobRequirements || '',
  //         questions:
  //           formData.InterviewQuestionsFormArray?.map((formQues, index) => ({
  //             question_number: index,
  //             question: formQues.question || '',
  //           })) || [],
  //       },
  //     } as CreateInteviewEntity;
  //     console.log('Interview Data:', interviewData);
  //     this.onSubmitData.emit(interviewData);
  //   } else {
  //     // Handle form errors
  //     Object.values(this.form.controls).forEach((control) => {
  //       control.markAsTouched();
  //       control.updateValueAndValidity();
  //     });
  //   }
  // }
  onCancel() {
    this.router.navigate(['/agents/interviews']);
  }

  get candidateFullName() {
    return this.form.controls.CandidateInformationFormGroup.controls
      .candidateFullName;
  }
  get candidateFullNameRequired() {
    return this.candidateFullName.hasError('required');
  }
  get candidateFullNameMaxLength() {
    return this.candidateFullName.hasError('maxlength');
  }

  get candidateEmail() {
    return this.form.controls.CandidateInformationFormGroup.controls
      .candidateEmail;
  }
  get candidateEmailRequired() {
    return this.candidateEmail.hasError('required');
  }
  get candidateEmailInvalid() {
    return this.candidateEmail.hasError('email');
  }
  //phone number
  get candidatePhone() {
    return this.form.controls.CandidateInformationFormGroup.controls
      .candidatePhone;
  }
  get candidatePhoneRequired() {
    return this.candidatePhone.hasError('required');
  }

  get candidatePhoneInvaildPattern() {
    return this.candidatePhone.hasError('pattern');
  }

  // country code
  get countryCode() {
    return this.form.controls.CandidateInformationFormGroup.controls
      .candidateCountryCode;
  }
  get countryCodeRequired() {
    return this.countryCode.hasError('required');
  }

  get countryCodeInvaildPattern() {
    return this.countryCode.hasError('pattern');
  }

  // candidate gender
  get candidateGender() {
    return this.form.controls.CandidateInformationFormGroup.controls
      .candidateGender;
  }
  get candidateGenderRequired() {
    return this.candidateGender.hasError('required');
  }

  get jobTitle() {
    return this.form.controls.JobInformationFormGroup.controls.jobTitle;
  }
  get jobTitleRequired() {
    return this.jobTitle.hasError('required');
  }
  get jobTitleMaxLength() {
    return this.jobTitle.hasError('maxlength');
  }

  get jobDescription() {
    return this.form.controls.JobInformationFormGroup.controls.jobDescription;
  }
  get jobDescriptionRequired() {
    return this.jobDescription.hasError('required');
  }
  get jobDescriptionMaxLength() {
    return this.jobDescription.hasError('maxlength');
  }

  get jobType() {
    return this.form.controls.JobInformationFormGroup.controls.jobType;
  }
  get jobTypeRequired() {
    return this.jobType.hasError('required');
  }

  get jobRequirements() {
    return this.form.controls.JobInformationFormGroup.controls.jobRequirements;
  }
  get jobRequirementsMaxLength() {
    return this.jobRequirements.hasError('maxlength');
  }

  get interviewQuestions(): FormArray<InterviewQuestionFormGroup> {
    return this.form.controls
      .InterviewQuestionsFormArray as FormArray<InterviewQuestionFormGroup>;
  }

  //submit handler
  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();

      // Convert to your interface
      const interviewData = {
        candidate_info: {
          full_name:
            formData.CandidateInformationFormGroup?.candidateFullName || '',
          email: formData.CandidateInformationFormGroup?.candidateEmail || '',
          phone:
            `${formData.CandidateInformationFormGroup?.candidateCountryCode}${formData.CandidateInformationFormGroup?.candidatePhone}` ||
            '',
          gender:
            formData.CandidateInformationFormGroup?.candidateGender.toLowerCase() ||
            '',
        },
        job_info: {
          title: formData.JobInformationFormGroup?.jobTitle || '',
          contract_type:
            formData.JobInformationFormGroup?.jobType.toLowerCase() || '',
          job_description:
            formData.JobInformationFormGroup?.jobDescription || '',
          job_requirements:
            formData.JobInformationFormGroup?.jobRequirements || '',
          questions:
            formData.InterviewQuestionsFormArray?.map((formQues, index) => ({
              question_number: index,
              question: formQues.question || '',
            })) || [],
        },
      } as CreateInteviewEntity;

      console.log('Interview Data:', interviewData);
      this.onSubmitData.emit(interviewData);
    } else {
      // Log validation errors
      console.log('Form is invalid. Validation errors:');
      this.logFormValidationErrors(this.form);

      // Handle form errors
      Object.values(this.form.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  // Helper method to log form validation errors
  private logFormValidationErrors(
    form: AbstractControl,
    formName: string = 'root'
  ): void {
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);
        if (control) {
          const controlName = `${formName}.${key}`;

          if (control.invalid) {
            console.log(`❌ ${controlName} is invalid:`, control.errors);
          }

          // Recursively check nested FormGroups and FormArrays
          if (control instanceof FormGroup || control instanceof FormArray) {
            this.logFormValidationErrors(control, controlName);
          }
        }
      });
    } else if (form instanceof FormArray) {
      form.controls.forEach((control, index) => {
        const controlName = `${formName}[${index}]`;

        if (control.invalid) {
          console.log(`❌ ${controlName} is invalid:`, control.errors);
        }

        // Recursively check nested FormGroups and FormArrays
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.logFormValidationErrors(control, controlName);
        }
      });
    }
  }

  // Alternative: More detailed logging method
  private logDetailedFormErrors(
    form: AbstractControl,
    formName: string = 'root'
  ): void {
    const errors: any[] = [];

    this.collectFormErrors(form, formName, errors);

    if (errors.length > 0) {
      console.log('=== FORM VALIDATION ERRORS ===');
      errors.forEach((error) => {
        console.log(`Field: ${error.field}`);
        console.log(`Errors:`, error.errors);
        console.log(`Value:`, error.value);
        console.log('---');
      });
    }
  }

  private collectFormErrors(
    form: AbstractControl,
    formName: string,
    errors: any[]
  ): void {
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);
        if (control) {
          const controlName = `${formName}.${key}`;

          if (control.invalid && control.errors) {
            errors.push({
              field: controlName,
              errors: control.errors,
              value: control.value,
            });
          }

          // Recursively check nested controls
          if (control instanceof FormGroup || control instanceof FormArray) {
            this.collectFormErrors(control, controlName, errors);
          }
        }
      });
    } else if (form instanceof FormArray) {
      form.controls.forEach((control, index) => {
        const controlName = `${formName}[${index}]`;

        if (control.invalid && control.errors) {
          errors.push({
            field: controlName,
            errors: control.errors,
            value: control.value,
          });
        }

        // Recursively check nested controls
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.collectFormErrors(control, controlName, errors);
        }
      });
    }
  }

  // Quick method to get summary of invalid fields
  private getInvalidFields(): string[] {
    const invalidFields: string[] = [];
    this.findInvalidControls(this.form, 'root', invalidFields);
    return invalidFields;
  }

  private findInvalidControls(
    form: AbstractControl,
    formName: string,
    invalidFields: string[]
  ): void {
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);
        if (control) {
          const controlName = `${formName}.${key}`;

          if (control.invalid) {
            invalidFields.push(controlName);
          }

          if (control instanceof FormGroup || control instanceof FormArray) {
            this.findInvalidControls(control, controlName, invalidFields);
          }
        }
      });
    } else if (form instanceof FormArray) {
      form.controls.forEach((control, index) => {
        const controlName = `${formName}[${index}]`;

        if (control.invalid) {
          invalidFields.push(controlName);
        }

        if (control instanceof FormGroup || control instanceof FormArray) {
          this.findInvalidControls(control, controlName, invalidFields);
        }
      });
    }
  }
}
