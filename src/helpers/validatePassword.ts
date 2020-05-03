const ValidatePassword = (password: string) => {
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
        return true;
    }
    alert('You have entered an invalid email address!');
    return false;
};

export default ValidatePassword;
