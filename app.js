let btn = document.querySelector("button");
let inp = document.querySelector("#password");

btn.addEventListener("click", randome);


function randome(length=12){
    console.log(length);

 const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 const lower = "abcdefghijklmnopqrstuvwxyz";
 const number = "0123456789";
 const char = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";
 
 const allChars = upper + lower +number + char;

let password = "";
password += upper[Math.floor(Math.random()*upper.length)];
password += lower[Math.floor(Math.random()*lower.length)];
password += number[Math.floor(Math.random()*number.length)];
password += char[Math.floor(Math.random()*char.length)];

while (password.length < length) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
}
password = password.slice(0, length);
inp.value = password;
}
