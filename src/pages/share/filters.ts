import { Pipe, PipeTransform } from "@angular/core";
import { checkStatus } from "./enums";


@Pipe({ name: 'filterStatus' })
//filter by enum checkStatus
export class FilterStatusPipe implements PipeTransform {

    transform(statusNumber: checkStatus, searchTerm: string = ""): any {
         //if the language is english
        if (localStorage.getItem('language') == 'en') {

            if (statusNumber == checkStatus.paid)
                return "paid";
            else
                if (statusNumber == checkStatus.returened)
                    return "returned";
                else
                    return "not paid";

        }
        else {
            //if the language is hebrow
            if (localStorage.getItem('language') == 'he') {

                if (statusNumber == checkStatus.paid)
                    return "שולם";
                else
                    if (statusNumber == checkStatus.returened)
                        return "חזר";
                    else
                        return "לא שולם";
            }
        }
    }
}