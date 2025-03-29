import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Juan Cruz Martínez',
        email: 'juancruzmart93@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        address: 'CHACO 1450 MNBK 12',
        city: 'Corrientes',
        postalCode: '3400',
        country: 'Argentina',
        tel: '3794065380',
        isAdmin: true
    },
]

export default users;