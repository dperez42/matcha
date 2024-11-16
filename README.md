# Matcha
it’s a dating WebSite where the user can create his profile, search other users, like them and begin a conversation with a chat if the person liked him back.

<h1>Techno</h1>
<h3>Server-side</h3>: Node JS and Express JS
<h3>Client-side</h3>: VUe+Vuetify
<h3>Database</h3>: MySql+PhpmyAdmin

to run:

sh 
sh start.sh <youIP> <BREVO-user = xx..xx@smtp-brevo.com> <BREVO_key = Uxbnsd...N> <debug mode=true/false>

p.e.  sh start.sh 192.168.1.43 6fsffsfsf1@smtp-brevo.com UxZBM83dfsffwG4vTFN false

Para cargar fake users...

python ./mysql/config/load_data.py

REGISTRATION 

- Verify by link send by email.
- Verify by OTP code send by email.
- Normal registration user-password

LOGIN

Loging by username and password. Restore password by email link.
