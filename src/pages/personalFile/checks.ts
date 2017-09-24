
export class Check {
    dealId: string;
    dealKey:string;
    id: number;
    bank:string;
    branch:number;
    checkNumber:number;
    firstName: string;
    dueDate = (new Date()).toISOString();
    checkStatus: string;
    updateStatus: string;
    checkKey:string;
    sum:number;
}