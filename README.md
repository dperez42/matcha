# matcha

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

- 
- Restore password by email link.
