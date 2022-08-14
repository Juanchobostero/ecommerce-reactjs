import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
    const [keyword, setKeyboard] = useState('');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        if(keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    }

    return (
        <Form 
            onSubmit={submitHandler} 
            className='d-flex'
            inline='true'
        >
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyboard(e.target.value)}
                placeholder='Search Products...'
                className='mr-sm-2 ml-sm-2'
            >
            </Form.Control>
            <Button
                type='submit'
                variant='outline-success'
                className='p-2'
            >
                Search
            </Button>
        </Form>
    )
}

export default SearchBox