<div class="register-block-wrapper">
    <div class="page-banner">
        <h1>Register</h1>
        <nav>
            <a href="index.php">Home</a>
            <p>&ensp;/&ensp;</p>
            <p>Register</p>
        </nav>
    </div>

    <form class="register-form" action="index.php" method="post">
        <div class="register-form-wrapper">
            <span id="loginTxt">User Name</span>
            <input type="text" name="userid" id="inputReg" require maxlength="20">
        
            <span id="loginTxt">Password</span>
            <input type="password" name="password" id="inputReg" require maxlength="30">
        
            <span id="loginTxt">Confirm Password</span>
            <input type="password" name="password2" id="inputReg" require maxlength="15">
        
            <span id="loginTxt">Full name</span>
            <input type="text" name="fullname" id="inputReg" require maxlength="30">
        
            <span id="loginTxt">E-mail address</span>
            <input type="text" name="email" id="inputReg" require maxlength="50">
        
            <input type="submit" value="REGISTER" name="" id="registerBtn" require>

            <div class="have-acc-block">
                <span>Have an Account?</span>
                <a href="index.php?content=login"><b>Login</b></a>
            </div>

            <input type="hidden" name="content" value="adduser" id="">
        </div>
    </form>
</div>
