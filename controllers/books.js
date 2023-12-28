const { query } = require('express');
const Book = require('../models/Book');
const Joi = require('joi');

// Kitap nesnesi doğrulama şeması
const kitapSchema = Joi.object({
    barkod: Joi.string().max(20).required(),
    yayinevi: Joi.string().required(),
    stok: Joi.number().integer().min(0).required(),
    fiyat: Joi.number().min(0).required(),
});

// Kitap ekleme endpoint'i
app.post('/ekle', (req, res) => {
    const { error } = kitapSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Verileri kullanarak kitap nesnesi oluşturabilirsiniz
    const yeniKitap = {
        barkod: req.body.barkod,
        yayinevi: req.body.yayinevi,
        stok: req.body.stok,
        fiyat: req.body.fiyat,
    };

    // Burada kitap nesnesini kullanarak istediğiniz işlemleri yapabilirsiniz (örneğin, veritabanına ekleme)

    res.json({ success: true, message: 'Kitap başarıyla eklendi.', kitap: yeniKitap });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.send('Havalı Kitap Projesine Hoş Geldiniz!');
});


const getAllBooks = async (req, res) => {

 //skip - atla demek
    //limit - şu kadar göster demek
    //query ile page ve limit alıp skip bunlarla hesaplatıyor

const page = number(req.query.page) || 1
const limit = number(req.query.limit) || 10
const skip = (page -1) * limit

console.log({sayfa: page, limit: limit, atla: skip});


    const books = await Book.find({}).skip(skip).limit(limit);
    return res.status(201).send({ message: "Başarılı", data: books, count: books.length })

}

const getBook = async (req, res) => {

    const id = req.params.id

    const book = await Book.findById(id)
    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }

    return res.status(201).send({ message: "Başarılı", data: book })

}

const addBook = async (req, res) => {

    const newBook = { title: req.body.title, author: req.body.author, publishYear: req.body.publishYear }
    const book = await Book.create(newBook)
    return res.status(201).send({ message: "Başarılı", data: book })

}

const updateBook = async (req, res) => {

    const { id } = req.params

    const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }

    return res.status(201).send({ message: "Başarılı", data: book })

}

const deleteBook = async (req, res) => {

    const { id } = req.params

    const book = await Book.findByIdAndDelete(id)
    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }
    return res.status(201).send({ message: "Başarılı", data: book })

}

module.exports = { getAllBooks, getBook, addBook, updateBook, deleteBook }