const express  = require('express')
const expressLayouts = require('express-ejs-layouts')

const { body, validationResult, check } = require('express-validator') 
const methodOverride = require('method-override')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000
// Setup method-override
app.use(methodOverride('_method'))
// Setup EJS
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
// Configuration flash
app.use(cookieParser('secret'))
app.use(session ({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)
})
// home page
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Azzam Rafi Zafran',
            email: 'azzamrafizafran@gmail.com'
        }
    ]
    res.render('index', 
    {
        layout: 'layouts/main-layout', 
        nama: 'Azzam', 
        title: 'Halaman Home', 
        mahasiswa
    })
    console.log('ini halaman home')
})
// about page
app.get('/about', (req, res, ) => {
    res.render('about', 
    {
        layout: 'layouts/main-layout', 
        title: 'Halaman About'
    })
})
// contact page
app.get('/contact', async (req, res) => {
    // Contact.find().then((contact) => {
    //     res.send(contact)
    // })

    const contacts = await Contact.find()
    res.render('contact', 
    {
        layout: 'layouts/main-layout', 
        title: 'Halaman Contact', 
        contacts, 
        msg: req.flash('msg')
    })
})
// form add contact page
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout'
    })
})
// proses add contact
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value })
        if(duplikat){
            throw new Error(`Nama ${value} sudah terdaftar`)
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('noHP', 'No Handphone tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() })
        res.render('add-contact', {
            title: 'Form Tambah Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array()
        })
    } else {
        Contact.insertMany(req.body, (erros, result) => {
            req.flash('msg', 'Data Contact berhasil ditambahkan')
            res.redirect('/contact')
        })

    }
})
// delete contact
app.delete('/contact', (req, res) => {
    Contact.deleteOne( { nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Data Contact berhasil dihapus')
        res.redirect('/contact')
    })
})
// form edit contact page
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        contact
    })
})
// proses edit contact
app.put('/contact', [
    body('nama').custom(async (value, {req}) => {
        const duplikat = await Contact.findOne({ nama: value})
        if(value !== req.body.oldNama && duplikat){
            throw new Error(`Nama ${value} sudah terdaftar`)
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('noHP', 'No Handphone tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() })
        res.render('edit-contact', {
            title: 'Form Edit Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        Contact.updateOne({
            _id: req.body._id }, 
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    noHP: req.body.noHP
                }
            }).then((result) => {         
                req.flash('msg', 'Data Contact berhasil diedit')
                res.redirect('/contact')
            })
    }
})
// detail contact page
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail Contact', 
        contact
    })
})
// 404
app.use((req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})