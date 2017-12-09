import { status, checkStatus } from '../pages/share/enums';

export class Check {
    bank: string;
    branch: number;
    checkKey: string;
    dealKey: string;
    dueDate = (new Date()).toISOString();
    expiredOn= (new Date()).toISOString();
    id: number;
    isDateOf: boolean;
    status: checkStatus; 
    sum: number;
    updateStatus: status; 
    
}