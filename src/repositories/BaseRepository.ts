import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(query: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(query).sort({createdAt: -1}).exec();
  }

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    return createdDocument.save();
  }

  async update(query: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(query, updateData, { new: true }).exec();
  }

  async delete(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(query).exec();
  }
}
