const container = document.querySelector(".container");
const bntSignIn = document.getElementById("bnt-sign-in");
const bntSignUp = document.getElementById("bnt-sign-up");

bntSignIn.addEventListener("click", ()=>{
    container.classList.remove("toggle");
}); 

bntSignUp.addEventListener("click", ()=>{
    container.classList.add("toggle");
});


 //icones de perfil de usuario

const profilePic = document.getElementById("profilePic");
const fileInput = document.getElementById("fileInput");

profilePic.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        profilePic.src = e.target.result;
    };
    reader.readAsDataURL(file);

});

