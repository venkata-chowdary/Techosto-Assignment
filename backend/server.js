const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors')
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors())


mongoose.connect(process.env.MONGOURL3, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    website: { type: String },
});

const User = mongoose.model('User', userSchema);

app.get('/api/get-user-details', (req, res) => {
    User.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error('Error retrieving users details:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

app.get('/api/get-user-details/:id', (req, res) => {
    const userId = req.params.id
    console.log(userId)

    User.findOne({ _id: userId })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            else{
                res.status(200).json(user);
            }
        })
        .catch((err) => {
            console.error('Error retrieving user details:', err);
            res.status(500).json({ message: 'Internal server error' });
        })
})


app.put('/api/edit-user-details/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, website } = req.body;
    console.log(name)

    User.findByIdAndUpdate(id, { name, email, phone, website }, { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User details updated successfully', user: updatedUser });
        })
        .catch((err) => {
            console.error('Error updating user details:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

app.delete('/api/delete-user/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    User.findByIdAndDelete(id)
        .then((result) => {
            if (result) {
                res.status(200).json({ message: 'User deleted successfully' })
            }
            else {
                res.status(404).json({ message: 'User not found' })
            }
        })
        .catch((err) => {
            console.log(err)
        })
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
