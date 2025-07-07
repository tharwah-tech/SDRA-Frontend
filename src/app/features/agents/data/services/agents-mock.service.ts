
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AgentEntity, OutputType } from '../../domain/entities/agent.entity';

@Injectable({
  providedIn: 'root'
})
export class AgentsMockService {
  private mockAgents: AgentEntity[] = [
    {
      id: '1',
      name: 'Saleh',
      role: 'Interviewer',
      description: 'Your professional AI interview agent designed to conduct comprehensive candidate evaluations with expertise and consistency.',
      avatarUrl: 'https://i.pravatar.cc/200?img=1',
      personality: [
        { id: '1', trait: 'Calm' },
        { id: '2', trait: 'Professional' },
        { id: '3', trait: 'Neutral Accent' }
      ],
      supportedOutputs: [
        { id: '1', type: OutputType.VIDEO, isEnabled: true },
        { id: '2', type: OutputType.AUDIO, isEnabled: true },
        { id: '3', type: OutputType.TRANSCRIPT, isEnabled: true }
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Sarah',
      role: 'HR Specialist',
      description: 'Expert AI agent specialized in HR processes, employee onboarding, and company culture assessment.',
      avatarUrl: 'https://i.pravatar.cc/200?img=5',
      personality: [
        { id: '1', trait: 'Friendly' },
        { id: '2', trait: 'Empathetic' },
        { id: '3', trait: 'Detail-oriented' }
      ],
      supportedOutputs: [
        { id: '1', type: OutputType.VIDEO, isEnabled: false },
        { id: '2', type: OutputType.AUDIO, isEnabled: true },
        { id: '3', type: OutputType.TRANSCRIPT, isEnabled: true }
      ],
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Ahmed',
      role: 'Technical Assessor',
      description: 'Specialized in conducting technical interviews and coding assessments for software engineering positions.',
      avatarUrl: 'https://i.pravatar.cc/200?img=3',
      personality: [
        { id: '1', trait: 'Analytical' },
        { id: '2', trait: 'Patient' },
        { id: '3', trait: 'Thorough' }
      ],
      supportedOutputs: [
        { id: '1', type: OutputType.VIDEO, isEnabled: true },
        { id: '2', type: OutputType.AUDIO, isEnabled: false },
        { id: '3', type: OutputType.TRANSCRIPT, isEnabled: true }
      ],
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    }
  ];

  getAgents(): Observable<AgentEntity[]> {
    return of(this.mockAgents).pipe(delay(500));
  }

  getAgentById(id: string): Observable<AgentEntity> {
    const agent = this.mockAgents.find(a => a.id === id);
    if (!agent) {
      throw new Error(`Agent with id ${id} not found`);
    }
    return of(agent).pipe(delay(300));
  }
}