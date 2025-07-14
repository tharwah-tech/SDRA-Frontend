
import { AgentEntity, AgentSummaryEntity } from '../../domain/entities/agent.entity';
import { AgentDto } from '../dtos/agent.dto';

export class AgentMapper {
  static toDto(entity: AgentEntity): AgentDto {
    return {
      id: entity.id,
      name: entity.name,
      role: entity.role,
      description: entity.description,
      avatarUrl: entity.avatarUrl,
      personality: entity.personality,
      supportedOutputs: entity.supportedOutputs,
      isActive: entity.isActive,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString()
    };
  }

  static toEntity(dto: AgentDto): AgentEntity {
    return {
      id: dto.id,
      name: dto.name,
      role: dto.role,
      description: dto.description,
      avatarUrl: dto.avatarUrl,
      personality: dto.personality,
      supportedOutputs: dto.supportedOutputs,
      isActive: dto.isActive,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined
    };
  }

  static toDtoList(entities: AgentEntity[]): AgentDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
