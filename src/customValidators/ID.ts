import { FormControl } from '@angular/forms';

export class IsID{
    static sumOfEvenDigits(control: number):number{
        if(control%1000){        
            return control%10+IsID.sumOfEvenDigits(Math.floor(control/100));
        }
        return 0;
    }
    static sumOfOddDigits(control: number):number{
        if(control%1000){     
            if(control%10*2>9){            
                return (control%10*2%10+Math.floor(control%10*2/10))+IsID.sumOfOddDigits(Math.floor(control/100));
            }    
            else{
                return control%10*2+IsID.sumOfOddDigits(Math.floor(control/100));
            }   
        }
        return 0;
    }
    static isValid(control: FormControl): any{        
        if((IsID.sumOfOddDigits(Math.floor((control.value as number)/10))+IsID.sumOfEvenDigits(control.value as number))%10==0){
            return null;
        }
         return {"notID": true};       
    }

}