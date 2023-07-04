import React, { useState } from 'react';
import Head from 'next/head';

const addContactCard = () => {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone ){
      alert('Please fill in all fields');
    }
    else {
      try {
        const response = await fetch('/api/contacts/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email }),
        });

        if (response.ok) {
          alert('Contact Added!');
          window.location.href = '/';
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update contacts.');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="absolute top-0 left-0 z-10 grid place-items-center w-screen h-[100dvh] bg-black p-8">
        <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <title>Add Contact | Nnisarg's Contacts</title>
        </Head>
      <div className="w-full h-full max-w-xl bg-gray-100 bg-opacity-5 p-8 text-xl text-white rounded-md shadow-md flex flex-col">
        <input
          id="name"
          className="text-3xl w-full bg-gray-100 bg-opacity-0 text-center truncate font-bold mb-32 focus:outline-none"
          placeholder='Contact Name'
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="mb-8">
          <p className="text-2xl font-semibold mb-2">Phone Number</p>
          <input
            id="phone"
            className="bg-gray-100 bg-opacity-0 border-b-white border-b font-regular focus:outline-none text-white w-full max-w-xl"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-8">
          <p className="text-2xl font-semibold mb-2">Email</p>
          <input
            id="email"
            className="bg-gray-100 bg-opacity-0 border-b-white border-b font-regular focus:outline-none text-white w-full max-w-xl"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-evenly gap-4 mt-auto text-2xl text-white">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 p-2 px-4 rounded-md"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 p-2 px-4 rounded-md">
            Add
            </button>
        </div>
      </div>
    </div>
  );
};

export default addContactCard;
