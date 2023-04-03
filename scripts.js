
window.onload = function () {
    loadLayout();
    loadTopBar();
    if (!location.pathname.includes('login')) {
        let token = localStorage.getItem('token');
        // console.log(token);
        if (!token) {
            window.location.replace('/login.html');
            return;
        }

        axios.get(`http://localhost/cse-482-server/api/user-authenticate.php?token=${token}`).then(response => {
            // console.log(response.data);
            // localStorage.setItem('user', JSON.stringify(response.data));
        }).catch(error => {
            // window.location.replace('/login.html');
            return;
        });
    }
};

const loadTopBar = () => {
    // create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // open a GET request for the header HTML file
    xhr.open('GET', 'header.html', true);

    // define a callback function to execute when the request is complete
    xhr.onload = function () {
        if (xhr.status === 200) {
            // insert the HTML into the header element
            document.getElementById('topbar').innerHTML = xhr.responseText;
            let user = JSON.parse(localStorage.getItem('user'));
            document.getElementById('user_name').innerText = user.name
            document.getElementById('user_role').innerText = user.role;
        }
    };

    // send the request
    xhr.send();
}

const loadLayout = () => {
    // create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // open a GET request for the header HTML file
    xhr.open('GET', 'sidebar.html', true);

    // define a callback function to execute when the request is complete
    xhr.onload = function () {
        if (xhr.status === 200) {
            // insert the HTML into the header element
            document.getElementById('header').innerHTML = xhr.responseText;

            //handling sidebar active
            // console.log(window.location.pathname)
            let path = window.location.pathname;
            if (path.includes('invoice')) {
                document.getElementById('invoice-sb').className = 'active_menu_item';
            }

            if (path.includes('user')) {
                document.getElementById('user-sb').className = 'active_menu_item';
            }

            if (path.includes('product')) {
                document.getElementById('prod-sb').className = 'active_menu_item';
            }
        }
    };

    // send the request
    xhr.send();
}

const showMessage = (message) => {
    Toastify({
        text: message,
        duration: 3000,
        position: 'center'
    }).showToast();
}

const handleCreateProduct = e => {
    e.preventDefault();

    const form = document.getElementById('cp-form');

    // get the form data
    const formData = new FormData(form);

    // convert the form data to URL encoded format
    const urlEncodedData = new URLSearchParams(formData).toString();

    // make an AJAX request using Axios
    axios.post('http://localhost/cse-482-server/api/create.php', urlEncodedData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(function (response) {
            console.log(response.data);
            window.location.replace('/manage-products.html')
            // do something with the response
        })
        .catch(function (error) {
            console.log(error);
            // handle the error
        });

}

const handleCreateUser = e => {
    e.preventDefault();

    let user = JSON.parse(localStorage.getItem('user'));
    if (user.role !== 'admin') {
        showMessage('You do not have permission for this action!');
        return;
    }

    let pass = document.forms["user-form"]["password"].value;
    let c_pass = document.forms["user-form"]["c-password"].value;
    console.log(pass, c_pass)
    if (pass !== c_pass) {
        showMessage("Password and Confirm Password must match");
        return;
    }


    const form = document.getElementById('user-form');

    // get the form data
    const formData = new FormData(form);

    // convert the form data to URL encoded format
    const urlEncodedData = new URLSearchParams(formData).toString();

    // make an AJAX request using Axios
    axios.post('http://localhost/cse-482-server/api/create-user.php', urlEncodedData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(function (response) {
            console.log(response.data);
            window.location.replace('/manage-users.html')
            // do something with the response
        })
        .catch(function (error) {
            console.log(error);
            // handle the error
        });
}

const handleDeleteUser = id => {
    axios.delete(`http://localhost/cse-482-server/api/delete-user.php?id=${id}`).then(response => {
        window.location.reload();
    })
}


const loginHandler = e => {
    e.preventDefault();

    const form = document.getElementById('login-form');

    // get the form data
    const formData = new FormData(form);

    // make an AJAX request using Axios
    axios.get('http://localhost/cse-482-server/api/user-login.php', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            username: formData.get('username'),
            password: formData.get('password'),
        }
    })
        .then(function (response) {
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.replace('/manage-products.html')
            // do something with the response
        })
        .catch(function (error) {
            showMessage('Invalid username or password');
            console.log(error);
            // handle the error
        });
}

const signOutHandler = () => {
    localStorage.removeItem('token');
    window.location.reload();
}