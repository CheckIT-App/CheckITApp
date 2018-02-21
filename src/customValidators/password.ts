import { FormControl } from '@angular/forms';

export class PasswordValidator {
     cntLetters: number = 0;
     cntDigits: number = 0;
    static val: string;
    static isValid(control: FormControl): any {
        // if (control.value) {
        //     console.log(control.value);
        //      this.val =control.value as string ;
        //     // while (this.val) {
        //     //     console.log(this.val + " " + this.cntDigits + " " + this.cntLetters);
        //     //     if ((Math.floor(this.val / 10) < 9 && Math.floor(this.val / 10) > 0))
        //     //         this.cntDigits++;
        //     //     else
        //     //         this.cntLetters++;
        //     //     this.val = Math.floor(this.val / 10);
        //     // }
        //     // if (this.cntLetters >= 4 && this.cntDigits >= 4) { return null; }
        //     return { "notValid": true };
        // }
       
    }
}