export interface ICourse {
    courseId: string;
    userId: string;
    active: Boolean;
    description: string;
    createdAt: Date;
    topics: string[];
}

