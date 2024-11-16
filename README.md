# Matcha (a 42 school Project)
It’s a dating WebSite where the user can create his profile, search other users, like them and begin a conversation with a chat if the person liked him back. (authors dperez-z & juan-gon).

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/main.png?raw=true)
<h2>Infraestructure</h2>

- Server-side: Node JS and Express JS
- Client-side: Vue+Vuetify
- Database: MySql+PhpmyAdmin
- Use a BREVO account to sent emails.

<h2>How to start</h2>
With command:

**sh start.sh 1 2 3 4**

- 1: Your IP
- 2: Your BREVO user  (p.e. xx..xx@smtp-brevo.com)
- 3: Your Brevo key   (p.e. Uxbnsd...N)
- 4: Enable/disable debug mode (false/true)

Example: 

**sh start.sh 192.168.1.43  6f....1@smtp-brevo.com U.....N false**

When everything is running, load fake users by;

**python ./mysql/config/load_data.py**

Note: user "Abc@12345" as password.

<h2>Features</h2>
<h5>Registration</h5>
You can registry with a email, username, first and second name, passaword and:
- Verify by link send by email.
- Verify by OTP code send by email.
- Normal registration user-password.

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/registration.png?raw=true)

<h5>Login</h5>
Loging by username and password. Restore password by email link.

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/login.png?raw=true)
<h5>Profile</h5>
After your first sign up you have to complete your profile.

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/profile1.png?raw=true) 

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/profile2.png?raw=true) 
<h5>Map of user</h5>
A map showing all users and on line. 

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/map.png?raw=true) 
<h5>Browsing</h5>
A list of swip cards with suggestions by sex, distance and age.

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/browsing.png?raw=true) 
<h5>Research</h5>
A list of users seleted by your criteria.

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/gallery.png?raw=true) 
<h5>Other users profile</h5>

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/other_profile.png?raw=true) 
<h5>Chat</h5>
If you like and recieve a like back, you can chat with her/him. To do this you have to have a picture in your avatar.

![alt text](https://github.com/dperez42/matcha/blob/main/pictures/chat.png?raw=true) 

<h5>Other features:</h5>

- Recieve notification of like, match, new message, view profile.
- A fame rating, common tags.
- Emoticons in chat message.
- A history of like and view profile.
- You can block or report as fake account a user, and you will never see him/her again or recieve notifications.


