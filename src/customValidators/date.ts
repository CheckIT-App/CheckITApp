import { FormControl } from '@angular/forms';

export class IsRelevantDateValidator{
    
    static isValid(control: FormControl): any{
        return IsRelevantDateValidator.checkDate(control.value);
    }

    static checkDate(date){
        var d=new Date();
        d.setMonth(d.getMonth()-6);
        if (Date.parse(date) >= d.getTime()){ return null; }
            return {"notValidityDate": true};
    }
}