import { AbstractControl, ValidatorFn } from "@angular/forms";

export function forbiddenPassValidator(forbiddenPass: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = forbiddenPass.test(control.value);
        return forbidden ? { 'forbiddenPassword': { value: control.value } } : null;
    };
}

export function matchPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password.pristine || confirmPassword.pristine) return null;
    console.log(password.value,confirmPassword.value, password.value !== confirmPassword.value)
    return password && confirmPassword && password.value !== confirmPassword.value ? { 'misMatch': true } : null;
}