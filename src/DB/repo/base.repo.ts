// import { QueryFilter, Types, UpdateResult } from "mongoose";
// import {UserHydrated,User} from "../../DB/models/user.model";
// import { IUser } from "../../module/common/interfaces/user.interface";
// import {CreateOptions, FlattenMaps, HydratedDocument, Model, PopulateOption, ProjectionType} from "mongoose" ;
// import { MongooseUpdateQueryOptions } from "mongoose";

// export abstract class BaseRepository<T>{
//     constructor(private model : Model<T>){}
//     create({
//         data
//     }:{
//         data :Partial<T>,
//         options? :CreateOptions;
//     }):
//     Promise<HydratedDocument<T>[]>

//     create({
//         data,
//         options,
//     }:{
//         data:Partial<T> | Partial<T>,
//         options?:CreateOptions;
//     }):Promise<HydratedDocument<T> | HydratedDocument<T>[]>{
//       return this.model.create(data as any,options)
//     };


//     findOne({
//         filter,
//         projection,
//         options,
//     } :{
//       filter?: QueryFilter<T>,
//       projection?: ProjectionType<T>,
//       options?: QueryOptions<T> &{lean :false };
   
//     }):Promise<HydratedDocument<T>|null>{
//         // return this.model.findOne(filter ,projection,options);
//     };

//     findOne({
//         filter,
//         projection,
//         options,
//     } :{
//       filter?: QueryFilter<T>,
//       projection?: ProjectionType<T>,
//       options?: QueryOptions<T>&{ lean : true},
   
//     }):Promise<FlattenMaps<T>|null>;

//     findOne({
//         filter,
//         projection,
//         options,
//     } :{
//       filter?: QueryFilter<T>,
//       projection?: ProjectionType<T>,
//       options?: QueryOptions<T> ,
   
//     }):Promise<HydratedDocument<T> |null | FlattenMaps<T>>{
//         const docs = this.model.findOne(filter ,projection,options);
//         if(options?.lean){
//          docs.lean() as FlattenMaps<T>;
//         };
//         if(options?.populate){
//                  docs.populate(options.populate as PopulateOptions) ;
//         }

//         return docs;
//     }



//         findById({
//         id,
//         projection,
//         options,
//     } :{
//       id: Types.ObjectId,
//       projection?: ProjectionType<T>,
//       options?: QueryOptions<T> &{lean :false };
   
//     }):Promise<HydratedDocument<T>|null>{
//         // return this.model.findOne(filter ,projection,options);
//     };

//     findById({
//        id,
//         projection,
//         options,
//     } :{
//       id: Types.ObjectId,
//       projection?: ProjectionType<T>,
//       options?: QueryOptions<T>&{ lean : true},
   
//     }):Promise<FlattenMaps<T>|null>;

//     findById({
//         id,
//         projection,
//         options,
//     } :{
//       id: Types.ObjectId,
//       projection?: ProjectionType<T>,
//       options?: QueryOptions<T> ,
   
//     }):Promise<HydratedDocument<T> |null | FlattenMaps<T>>{
//         const docs = this.model.findById(id ,projection);
//         if(options?.lean){
//          docs.lean() as FlattenMaps<T>;
//         };
//         if(options?.populate){
//                  docs.populate(options.populate as PopulateOptions) ;
//         }

//         return docs;
//     }

//     updateOne({
//         filter,
//         update,
//         options,
//     }:{
//          filter: QueryFilter<T>,
//               update: UpdateQuery<T>,
//               options?: (mongodb.UpdateOptions) 
//     }):Promise<UpdateResult>{
//         return this.model.updateOne(filter,update,options)       
//     }


//       updateMany({
//         filter,
//         update,
//         options,
//     }:{
//          filter: QueryFilter<T>,
//               update: UpdateQuery<T>,
//               options?: (mongodb.UpdateOptions) 
//     }):Promise<UpdateResult>{
//         return this.model.updateMany(filter,update,options)       
//     }

// deleteOne({
//     filter,
//       options,
// }:{
//      filter?: QueryFilter<T>,
//       options?: MongooseUpdateQueryOptions<T>,
// }):Promise<DeleteResult>{
// return this.model.deleteOne(filter);
// }
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////
import {
  Model,
  Types,
 FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  PopulateOptions,
  CreateOptions,
  HydratedDocument,
  FlattenMaps,
  UpdateWriteOpResult,
  QueryFilter,
  PopulatePathToRawDocType,
} from "mongoose";
import { DeleteResult } from "mongodb";

// Shared shape for read-query options across findOne/findById
type ReadOptions<T> = QueryOptions<T> & {
  populate?: PopulateOptions | PopulateOptions[];
};

export abstract class BaseRepository<T> {
  // `protected` so subclasses can access `this.model`; no need to leak
  // model-specific imports (User, IUser, etc.) into this generic file.
  constructor(protected readonly model: Model<T>) {}

  // ---------------- CREATE ----------------
  // Two real overloads: single doc in -> single doc out,
  // array in -> array out. This mirrors Mongoose's own behavior,
  // so callers get accurate types instead of a forced union + `as any`.
  create(data: Partial<T>, options?: CreateOptions): Promise<HydratedDocument<T>>;
  create(data: Partial<T>[], options?: CreateOptions): Promise<HydratedDocument<T>[]>;
  create(
    data: Partial<T> | Partial<T>[],
    options?: CreateOptions
  ): Promise<HydratedDocument<T> | HydratedDocument<T>[]> {
    return this.model.create(data as any, options) as any;
  }

  // ---------------- FIND ONE ----------------
  // Overload signatures MUST end in `;` (no body). Only the last
  // signature (the implementation) has a body. `lean` in options
  // toggles the return type between HydratedDocument and FlattenMaps.
  findOne(params: {
    filter?: FilterQuery<T>;
    projection?: ProjectionType<T>;
    options: ReadOptions<T> & { lean: true };
  }): Promise<FlattenMaps<T> | null>;

  findOne(params: {
    filter?: FilterQuery<T>;
    projection?: ProjectionType<T>;
    options?: ReadOptions<T> & { lean?: false };
  }): Promise<HydratedDocument<T> | null>;

  async findOne({
    filter,
    projection,
    options,
  }: {
    filter?: FilterQuery<T>;
    projection?: ProjectionType<T>;
    options?: ReadOptions<T>;
  }): Promise<HydratedDocument<T> | FlattenMaps<T> | null> {
    // Build the query; Mongoose query builder methods return a query
    // (not void), so we must chain/reassign rather than call-and-drop.
    let query = this.model.findOne(filter, projection, options);

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    // `.lean()` changes the resolved type -> only branch here returns it.
    if (options?.lean) {
      return query.lean<FlattenMaps<T>>().exec();
    }

    return query.exec();
  }

  // ---------------- FIND BY ID ----------------
  findById(params: {
    id: Types.ObjectId | string;
    projection?: ProjectionType<T>;
    options: ReadOptions<T> & { lean: true };
  }): Promise<FlattenMaps<T> | null>;

  findById(params: {
    id: Types.ObjectId | string;
    projection?: ProjectionType<T>;
    options?: ReadOptions<T> & { lean?: false };
  }): Promise<HydratedDocument<T> | null>;

  async findById({
    id,
    projection,
    options,
  }: {
    id: Types.ObjectId | string;
    projection?: ProjectionType<T>;
    options?: ReadOptions<T>;
  }): Promise<HydratedDocument<T> | FlattenMaps<T> | null> {
    // BUG FIX: original code never passed `options` into findById at all.
    let query = this.model.findById(id, projection, options);

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    if (options?.lean) {
      return query.lean<FlattenMaps<T>>().exec();
    }

    return query.exec();
  }

  // ---------------- UPDATE ONE ----------------
  updateOne({
    filter,
    update,
    options,
  }: {
    filter: FilterQuery<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update).exec();
  }

  // ---------------- UPDATE MANY ----------------
  updateMany({
    filter,
    update,
    options,
  }: {
    filter: FilterQuery<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, update).exec();
  }

  // ---------------- DELETE ONE ----------------
  deleteOne({
    filter,
    options,
  }: {
    filter?: FilterQuery<T>;
    options?: QueryOptions<T>;
  }): Promise<DeleteResult> {
    // BUG FIX: original code dropped `options` on the floor.
    return this.model.deleteOne(filter).exec();
  }

  findOneAndUpdate({
    filter,
    update,
    options,
  }:{
    filter?:QueryFilter<T>;
    update?:UpdateQuery<T>;
    options ?:QueryOptions<T>;
  }):Promise<HydratedDocument<T> |null |FlattenMaps<T>>{
    const docs = this.model.findOneAndUpdate(filter,update,options);
    if(options?.populate){
        docs.populate(options.populate as PopulateOptions);
    }
    if(options?.lean){
        docs.lean() as FlattenMaps<T>;
    }
    return docs.exec();
  }

  findOneAndDelete({
    filter,
    options,
  }:{
    filter?:QueryFilter<T>;
    options ?:QueryOptions<T>;
  }):Promise<HydratedDocument<T> |null |FlattenMaps<T>>{
    const docs = this.model.findOneAndDelete(filter,options);
    if(options?.populate){
        docs.populate(options.populate as PopulateOptions);
    }
    if(options?.lean){
        docs.lean() as FlattenMaps<T>;
    }
    return docs.exec();
  }

  
}