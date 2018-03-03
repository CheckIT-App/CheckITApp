import { Pipe, PipeTransform } from "@angular/core";
import { checkStatus } from "./enums";


@Pipe({ name: 'filterStatus' })

export class FilterStatusPipe implements PipeTransform {

    transform(statusNumber: checkStatus, searchTerm: string = ""): any {
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
            if (localStorage.getItem('language') == 'en') {

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