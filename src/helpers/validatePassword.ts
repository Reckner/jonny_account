const ValidatePassword = (password: string) => {
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
        return true;
    }
    return false;
};

export default ValidatePassword;
