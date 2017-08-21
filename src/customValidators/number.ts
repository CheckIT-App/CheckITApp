import { FormControl } from '@angular/forms';

export class IsNumberValidator{

    static isValid(control: FormControl): any{
        if (control.value >= 0){ return null; }
            return {"notNumber": true};
    }

}