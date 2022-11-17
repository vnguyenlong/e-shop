const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'Không tìm thấy được người dùng'})
    }
    res.status(200).send(user);
});


router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        street: req.body.street,
    })
    user = await user.save();

    if (!user)
    return res.status(404).send('Không tạo được User')
    res.send(user);
})

router.put('/:id', async (req, res) => {
    const userExists = await User.findById(req.params.id);
    let newPassword
    if (req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExists.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
            street: req.body.street,
        },
        { new: true }
    )

    if(!user)
    return res.status(400).send('Update không thành công')

    res.send(user);
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.bodey.email});

    if(!user){
        return res.status(400).send('Không tìm thấy người dùng');
    }
    return res.status(200).send(user);
})

module.exports = router;