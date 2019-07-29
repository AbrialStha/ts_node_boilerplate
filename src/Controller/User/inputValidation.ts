import validator from "validator";
import { isEmpty } from "../../utils/helper";

interface register_data {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface login_data {
    email: string;
    password: string;
}

//For Register
export const validateRegisterInput = (data: register_data) => {
    let errors: { [key: string]: any } = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirm_password = !isEmpty(data.confirm_password)
        ? data.confirm_password
        : "";

    //For Name field
    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 charecters";
    } else if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    //For Email field
    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    //For Password
    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be atleast 6 charecters";
    }

    //For confirm_password
    if (validator.isEmpty(data.confirm_password)) {
        errors.confirm_password = "Confirm Password field is required";
    } else if (!validator.equals(data.password, data.confirm_password)) {
        errors.confirm_password = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

//For Login
export const validateLoginInput = (data: login_data) => {
    let errors: { [key: string]: string } = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    //For Email field
    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    //For Password
    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be atleast 6 charecters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};