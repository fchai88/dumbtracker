export interface Demographics {
    weight: string;
    heightFt: string;
    heightIn: string;
}

export class UserDetail {
    constructor(
        public userId: string,
        public displayName: string,
        public demographics: Demographics,
        public goals: string
    ) {}
}