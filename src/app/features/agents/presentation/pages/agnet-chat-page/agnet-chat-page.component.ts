import { Component, DestroyRef, input, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ApiError } from '../../../../../core/models/api-error.model';
import { Observable } from 'rxjs';
import { RagConversationEntity } from '../../../domain/entities/rag-conversation.entity';
import { LanguageService } from '../../../../../core/services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  selectRagLoading,
  selectRagSelectedConversation,
} from '../../store/rags/rag.selectors';
import { selectRagError } from '../../store/rags/rag.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RagsActions } from '../../store/rags/rag.actions';
import { filter, tap } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-agnet-chat-page',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MainPageStructureComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TextFieldModule,
  ],
  templateUrl: './agnet-chat-page.component.html',
  styleUrl: './agnet-chat-page.component.scss',
})
export class AgnetChatPageComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  SideNavTabs = SideNavTabs;
  agentId = input.required<string>();
  lang = input.required<string>();
  conversationId = input<string>();
  error$: Observable<ApiError | null>;
  loading$: Observable<boolean>;
  selectedConversation$: Observable<RagConversationEntity | null>;
  conversation: RagConversationEntity | null = null;

  // Chat properties
  messageText: string = '';
  isRecording: boolean = false;
  sendingMessage: boolean = false;
  recordingTime: number = 0;
  private recordingInterval: any;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  private route = inject(ActivatedRoute);

  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private router: Router,
    private toastr: ToastrService,
    private destroyRef: DestroyRef,
    private store: Store
  ) {
    this.error$ = this.store.select(selectRagError);
    this.loading$ = this.store.select(selectRagLoading);
    this.selectedConversation$ = this.store.select(
      selectRagSelectedConversation
    );
  }

  ngOnInit(): void {
    // Load conversation if conversationId is provided
    if (this.conversationId()) {
      this.store.dispatch(
        RagsActions.loadRagConversation({ id: this.conversationId()! })
      );
    } else {
      // Start a new conversation if no conversationId
      this.startNewConversation();
    }

    this.selectedConversation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((conversation) => {
        this.conversation = conversation as RagConversationEntity;
        this.scrollToBottom();
      });

    // Handle errors
    this.error$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((error) => !!error),
        tap((error) => {
          this.toastr.error(error?.message || 'An error occurred', 'Error');
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  // Message tracking for ngFor optimization
  trackByMessage(index: number, message: any): string {
    return message.message_date + index;
  }

  // Handle Enter key press
  onEnterPress(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendTextMessage();
    }
  }

  // Send text message
  sendTextMessage(): void {
    if (!this.messageText?.trim() || this.sendingMessage) {
      return;
    }

    this.sendingMessage = true;
    this.store.dispatch(
      RagsActions.sendRagTextMessage({
        agentId: this.agentId(),
        textMessage: this.messageText.trim(),
      })
    );

    this.messageText = '';
    this.sendingMessage = false;
  }

  // Start new conversation
  startNewConversation(): void {
    this.store.dispatch(
      RagsActions.startRagConversation({
        agentId: this.agentId(),
      })
    );
  }

  // Toggle audio recording
  async toggleRecording(): Promise<void> {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  // Start audio recording
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.sendAudioMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.startRecordingTimer();
    } catch (error) {
      console.error('Error starting recording:', error);
      this.toastr.error('Failed to start recording. Please check microphone permissions.', 'Error');
    }
  }

  // Stop audio recording
  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopRecordingTimer();
    }
  }

  // Start recording timer
  private startRecordingTimer(): void {
    this.recordingTime = 0;
    this.recordingInterval = setInterval(() => {
      this.recordingTime++;
    }, 1000);
  }

  // Stop recording timer
  private stopRecordingTimer(): void {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
  }

  // Send audio message
  private sendAudioMessage(audioBlob: Blob): void {
    this.sendingMessage = true;

    // Convert blob to base64 for API
    const reader = new FileReader();
    reader.onload = () => {
      const base64Audio = reader.result as string;
      const audioData = base64Audio.split(',')[1]; // Remove data URL prefix

      this.store.dispatch(
        RagsActions.sendRagAudioMessage({
          agentId: this.agentId(),
          audioMessage: audioData,
        })
      );

      this.sendingMessage = false;
    };

    reader.readAsDataURL(audioBlob);
  }

  // Scroll to bottom of messages
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  CurrentPagePath(): RouteLink[] {
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      {
        path: `/${this.lang()}/agents/agent/${this.agentId()}`,
        label: 'Agent Chat',
      },
    ];
  }
}
