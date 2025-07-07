import { Injectable } from '@angular/core';
import {AgentsRepository} from '../../domain/repositories/agents.repository';

@Injectable({
  providedIn: 'root'
})
export class AgentsService implements AgentsRepository{

  constructor() { }
}
