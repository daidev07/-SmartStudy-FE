<template>

    <body>
        <div class="container">
            <div class="form-box login">
                <form action="">
                    <h1 class="fw-bold">Login</h1>
                    <div class="input-box">
                        <input type="text" placeholder="Username">
                        <i class='bx bxs-user'></i>
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="Password">
                        <i class='bx bxs-hide'></i>
                        <!-- <i class='bx bxs-show'></i> -->
                    </div>
                    <div class="forgot-link">
                        <RouterLink to="/forgot-password" class="forgot-link-router">Forgot Password?</RouterLink>
                    </div>
                    <button type="submit" class="btn">Login</button>
                </form>
            </div>
            <div class="toggle-box">
                <div class="toggle-panel toggle-left">
                    <h1 class="fw-bold">Hello, Welcome!</h1>
                    <p>Conquer the latest TOEIC tests and receive detailed analysis from Artificial Intelligence,
                        helping to improve your
                        English skills most effectively.
                    </p>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
export default {
    name: 'LoginComponent',
}
</script>
<style scoped>
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
}

.container {
    position: relative;
    width: 850px;
    height: 550px;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, .2);
    overflow: hidden;
}

.form-box {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    color: #333;
    text-align: center;
    padding: 40px;
    z-index: 1;
}

form {
    width: 100%;
}

.container h1 {
    font-size: 36px;
    margin: -10px 0;
}

.input-box {
    position: relative;
    margin: 30px 0;
}

.input-box input {
    width: 100%;
    padding: 13px 50px 13px 20px;
    background: #eee;
    border: none;
    border-radius: 8px;
    outline: none;
    color: #333;
    font-size: 16px;
    font-weight: 500;
}

.intput-box intput::placeholder {
    color: #888;
    font-weight: 400;
}

.input-box i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #888;
}

.forgot-link {
    margin: -15px 0 15px;
}

.forgot-link-router {
    color: #333;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
}

.btn {
    width: 100%;
    height: 48px;
    background: #7494ec;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
}

.toggle-box {
    position: absolute;
    width: 100%;
    height: 100%;
}

.toggle-box::before {
    content: '';
    position: absolute;
    left: -250%;
    width: 300%;
    height: 100%;
    background: #7494ec;
    border-radius: 150px;
    z-index: 2;
}

.toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.toggle-panel p {
    margin: 30px;
    font-size: 20px;
    text-align: justify;
}
</style>