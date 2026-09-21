export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან.";
  }
  if (!/[A-Z]/.test(password)) {
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს (A-Z).";
  }
  if (!/\d/.test(password)) {
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს (0-9).";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ სპეციალურ სიმბოლოს (მაგ: !, @, #, $).";
  }
  return null;
};
