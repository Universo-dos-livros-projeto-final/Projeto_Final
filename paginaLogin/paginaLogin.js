const container = document.querySelector(".container");
const bntSignIn = document.getElementById("bnt-sign-in");
const bntSignUp = document.getElementById("bnt-sign-up");

bntSignIn.addEventListener("click", ()=>{
    container.classList.remove("toggle");
}); 

bntSignUp.addEventListener("click", ()=>{
    container.classList.add("toggle");
});




// icones de perfil de usuario


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



// sign up code by: Namorado da Nayra

const [firstname, setfirstname] = useState('')
  const [lastname, setlastname] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  //This function records the current value of the input element whenever the form is submitted; Prevents the default HTML form behavior of navigating to a new page.
  function handleSubmitSignUp(e) {
    e.preventDefault();

    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, username, password })
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === 'User created sucessfully') {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setfirstname('');
    setlastname('');
    setEmail('');
    setUsername('');
    setPassword('');
    setIsDisabled(true);
}

function handleChangefirstname(event) {
    setfirstname(event.target.value);
}

function handleChangelastname(event) {
    setlastname(event.target.value);
}

function handleChangeEmail(event) {
    setEmail(event.target.value);
}

function handleChangeUsername(event) {
    setUsername(event.target.value.toLowerCase());
}

function handleChangePassword(event) {
    setPassword(event.target.value.toLowerCase());
}

useEffect(() => {
    if (password !== '' && username !== '' && email !== '' && lastname !== '' && firstname !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
}, [firstname, lastname, email, username, password]);

// Sign In code by: Namorado da Nayra

const [errorMessage] = useState('');

//This function records the current value of the input element whenever the form is submitted; Prevents the default HTML form behavior of navigating to a new page.
function handleSubmitLogin(e) {
    e.preventDefault();

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === 'User logged in successfully') {
          const token = data.token;

          const cookies = new Cookies();

          // Store token in cookies
          cookies.set('token', token, { path: '/' });
          navigate('/home');
        }
      })
      .catch((error) => console.error(error));

    setUsername('');
    setPassword('');
    setIsDisabled(true);
}

function handleChangeUsername(event) {
    setUsername(event.target.value.toLowerCase());
}

function handleChangePassword(event) {
    setPassword(event.target.value.toLowerCase());
}

useEffect(() => {
    if (password !== '' && username !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
}, [username, password]);






















// Se dediquem mais a isto ou não conseguirão fazer tudo que é preciso, principalmente no back-end. Vos desejo foco e motivação, isto não é lego onde as coisas se encaixam facilmente. Eu acredito em vocês, vos desejo sucesso!!! :)