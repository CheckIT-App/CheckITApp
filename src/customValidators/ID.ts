import { FormControl } from '@angular/forms';

export class IsID {

    static identityKind;

    static sumOfEvenDigits(control: number): number {
        if (control % 1000) {
            return control % 10 + IsID.sumOfEvenDigits(Math.floor(control / 100));
        }
        return 0;
    }
    static sumOfOddDigits(control: number): number {
        if (control % 1000) {
            if (control % 10 * 2 > 9) {
                return (control % 10 * 2 % 10 + Math.floor(control % 10 * 2 / 10)) + IsID.sumOfOddDigits(Math.floor(control / 100));
            }
            else {
                return control % 10 * 2 + IsID.sumOfOddDigits(Math.floor(control / 100));
            }
        }
        return 0;
    }

    // static setKindInStaticClass(kind) {
    //     IsID.identityKind = kind;
    // }

    // static isValid(control: FormControl): any {
    //     console.log("isValid");
    //     return IsID.checkID(control.value);
    // }

    static checkID(control: FormControl): any {
        return IsID.checkIDAsNumber(control.value as number);
    }

    static checkPassport(control: FormControl): any {
        return IsID.checkPassportAsNumber(control.value);
    }

    static checkIDAsNumber(ID: number): any {
        if (ID != 0 && (IsID.sumOfOddDigits(Math.floor((ID as number) / 10)) + IsID.sumOfEvenDigits(ID as number)) % 10 == 0) {
            return null;
        }
        return { "notValidID": true };
    }

    static checkPassportAsNumber(passport: number): any {
        if (passport >= 100000000 && passport <= 999999999) {//check if length of the passport number is 9 digits
            return null;
        }
        return { "notValidPassport": true };
    }
}