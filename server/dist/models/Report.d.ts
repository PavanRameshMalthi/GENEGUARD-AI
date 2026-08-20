import mongoose from 'mongoose';
export declare const Report: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    aiSummary?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    aiSummary?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    aiSummary?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    aiSummary?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    aiSummary?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    aiSummary?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
