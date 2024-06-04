import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import { validateOrReject } from 'class-validator';
  import slugify from 'slugify';
  import { Sequelize, Model  } from 'sequelize-typescript';
  import { MessageMapper } from './mappers/message.mapper';
  import { isNull, isUndefined } from './utils/validation.util';
  
  @Injectable()
  export class CommonService {
    private readonly logger: Logger;
  
    constructor(private readonly sequelize: Sequelize) {
      this.logger = new Logger(CommonService.name);
    }
  
    /**
     * Validate Entity
     *
     * Validates an entity with the class-validator library
     */
    public async validateEntity(entity: any): Promise<void> {
      try {
        await validateOrReject(entity);
      } catch (errors) {
        const messages = errors.map((error) => Object.values(error.constraints)).flat();
        throw new BadRequestException(messages.join(',\n'));
      }
    }
  
    /**
     * Check Entity Existence
     *
     * Checks if a findOne query didn't return null or undefined
     */
    public checkEntityExistence(entity: any, name: string): void {
      if (isNull(entity) || isUndefined(entity)) {
        throw new NotFoundException(`${name} not found`);
      }
    }
  
    /**
     * Save Entity
     *
     * Validates, saves, and flushes entities into the DB
     */
    public async saveEntity<T extends Model<T>>(
        entity: T,
        isNew = false,
      ): Promise<void> {
        await this.validateEntity(entity);
    
        if (isNew) {
          await entity.save();
        }
    
        await this.throwDuplicateError(entity.save());
      }
    
  
    /**
     * Remove Entity
     *
     * Removes an entity from the DB.
     */
    public async removeEntity(entity: any): Promise<void> {
      await this.throwInternalError(entity.destroy());
    }
  
    /**
     * Throw Duplicate Error
     *
     * Checks if an error is a duplicate value error and throws a conflict exception
     */
    public async throwDuplicateError<T>(promise: Promise<T>, message?: string): Promise<T> {
      try {
        return await promise;
      } catch (error) {
        this.logger.error(error);
  
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new ConflictException(message ?? 'Duplicated value in database');
        }
  
        throw new BadRequestException(error.message);
      }
    }
  
    /**
     * Throw Internal Error
     *
     * Function to abstract throwing internal server exception
     */
    public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
      try {
        return await promise;
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  
    /**
     * Format Name
     *
     * Takes a string, trims it, and capitalizes every word
     */
    public formatName(title: string): string {
      return title
        .trim()
        .replace(/\n/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
    }
  
    /**
     * Generate Point Slug
     *
     * Takes a string and generates a slug with dots as word separators
     */
    public generatePointSlug(str: string): string {
      return slugify(str, { lower: true, replacement: '.', remove: /['_\.\-]/g });
    }
  
    public generateMessage(message: string): MessageMapper {
      return new MessageMapper(message);
    }
  }
  