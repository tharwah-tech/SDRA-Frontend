import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
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

type CandidateInformationFormGroup = FormGroup<{
  candidateFullName: FormControl<string>;
  candidateEmail: FormControl<string>;
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
  form: InterviewFormGroup;
  maxTitle = 60;
  maxDescription = 512;
  GenderType = GenderType;
  GenderTypeKeys = Object.keys(GenderType); // Get enum keys
  GenderTypeValues = Object.values(GenderType); // Get enum values
  JobType = JobType;
  JobTypeKeys = Object.keys(JobType); // Get enum keys
  JobTypeValues = Object.values(JobType); // Get enum values
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
    this.form = fb.group({
      CandidateInformationFormGroup: fb.group({
        candidateFullName: fb.control('', {
          validators: [Validators.required],
        }),
        candidateEmail: fb.control('', {
          validators: [Validators.required, Validators.email],
        }),
        candidatePhone: fb.control('', {
          validators: [Validators.required, Validators.pattern('^[0-9]{10}$')],
        }),
        candidateGender: fb.control<GenderType>('' as GenderType, {
          validators: [Validators.required],
        }),
      }),
      JobInformationFormGroup: fb.group({
        jobTitle: fb.control('', { validators: [Validators.required] }),
        jobDescription: fb.control('', { validators: [Validators.required] }),
        jobType: fb.control<JobType>(JobType.FullTime, {
          validators: [Validators.required],
        }),
        jobRequirements: fb.control('', { validators: [Validators.required] }),
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
  onSubmit() {
    if (this.form.valid) {
      const interviewData = this.form.value;
      // Handle the submission logic here, e.g., dispatch an action or call a service
      console.log('Interview Data:', interviewData);
    } else {
      // Handle form errors
      Object.values(this.form.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }
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

  get candidatePhone() {
    return this.form.controls.CandidateInformationFormGroup.controls
      .candidatePhone;
  }
  get candidatePhoneRequired() {
    return this.candidatePhone.hasError('required');
  }

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
  get jobRequirementsRequired() {
    return this.jobRequirements.hasError('required');
  }
  get jobRequirementsMaxLength() {
    return this.jobRequirements.hasError('maxlength');
  }

  get interviewQuestions(): FormArray<InterviewQuestionFormGroup> {
    return this.form.controls
      .InterviewQuestionsFormArray as FormArray<InterviewQuestionFormGroup>;
  }
}
