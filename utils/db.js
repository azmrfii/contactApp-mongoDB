const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/contactapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

// const Contact = mongoose.model('Contact', {
//     nama: {
//         type: String,
//         required: true
//     },
//     noHP: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String
//     }
// })

// const contact1 = new Contact({
//     nama: 'Azzam Rafi Zafran',
//     noHP: '087844396570',
//     email: 'azzamrafizafran@gmail.com'
// })

// contact1.save().then((contact) => console.log(contact))