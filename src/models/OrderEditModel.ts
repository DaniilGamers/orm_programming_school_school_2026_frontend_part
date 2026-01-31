export interface OrderEditModel {
    id: number;
    data: {
        name: string;
        surname: string;
        email: string;
        phone: number | null;
        age: number | null;
        course: string;
        course_format: string;
        course_type: string;
        sum: number | null;
        alreadyPaid: number | null;
        status: string;
        group_id: number | null;
        manager: string
    }
}