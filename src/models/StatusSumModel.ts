import {StatusCountModel} from "./StatusCountModel";

export interface StatusSumModel {
    total: number;
    by_status: StatusCountModel[]
}