const semail=require('@sendgrid/mail');
const key="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";

semail.setApiKey(key);
semail.send({
    to:'ayushgsu2018@gmail.com',
    from:'ayushgsu2018@gmail.com',
    subject:'aise hi',
    text:'bhai ji '  
})