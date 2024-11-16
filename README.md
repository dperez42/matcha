# Matcha
it’s a dating WebSite where the user can create his profile, search other users, like them and begin a conversation with a chat if the person liked him back.

<h2>Infraestructure</h2>
<h3>Server-side</h3>Node JS and Express JS
<h3>Client-side</h3>VUe+Vuetify
<h3>Database</h3>MySql+PhpmyAdmin
<h2>How to start</h2>
With command:

sh start.sh 1 2 3 4

- 1: Your IP
- 2: Your BREVO user  (p.e. xx..xx@smtp-brevo.com)
- 3: Your Brevo key   (p.e. Uxbnsd...N)
- 4: Enable/disable debug mode (false/true)

Example: sh start.sh 192.168.1.43  6f....1@smtp-brevo.com U.....N false

When everything is running, load fake users by;

python ./mysql/config/load_data.py

<h2>Features</h2>
<h5>Registration</h5>
You can registry with a email, username, first and second name, passaword and:
- Verify by link send by email.
- Verify by OTP code send by email.
- Normal registration user-password.

LOGIN

Loging by username and password. Restore password by email link.

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")
![alt text](https://github.com/dperez42/matcha/raw/master/pictures/registration.png "Logo Title Text 1")
<span>https://github.com/dperez42/matcha/blob/main/matcha/pictures/registration.png<span>
<span>![</span><span>Aquí la descripción de la imagen por si no carga</span><span>]</span><span>(</span><span>//raw.githubusercontent.com/dperez42/matcha/blob/main/matcha/pictures/registration.png</span><span>)</span>