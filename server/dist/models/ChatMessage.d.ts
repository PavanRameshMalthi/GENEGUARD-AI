import mongoose from 'mongoose';
export declare const ChatMessage: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        role?: "user" | "assistant" | null | undefined;
        content?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
