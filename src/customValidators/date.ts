import { FormControl } from '@angular/forms';

export class IsRelevantDateValidator{
    
    static isValid(control: FormControl): any{
        if (Date.parse(control.value) >= Date.now()){ return null; }
            return {"notValidityDate": true};
    }

}