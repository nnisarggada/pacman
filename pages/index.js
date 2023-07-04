import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiExport, BiSearch } from 'react-icons/bi';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentContact, setCurrentContact] = useState({});
  const [currentContactIndex, setCurrentContactIndex] = useState();
  const [showContact, setShowContact] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch('/vcf/contacts.vcf');
    const vcfData = await response.text();
    const parsedContacts = parseVCF(vcfData);
    setContacts(parsedContacts);
  };

  const parseVCF = (vcfData) => {
    const contacts = [];
    const lines = vcfData.split('\n');

    let contact = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === 'BEGIN:VCARD') {
        contact = {};
        contact.id = i;
      } else if (line === 'END:VCARD') {
        contacts.push(contact);
      } else if (line.startsWith('FN:')) {
        contact.name = line.substring(3);
      } else if (line.startsWith('TEL:')) {
        contact.phone = line.substring(line.indexOf(':') + 1);
      } else if (line.startsWith('EMAIL:')) {
        contact.email = line.substring(line.indexOf(':') + 1);
      }
    }

    return contacts;
  };

  const ContactCard = ({ contact, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(contact.name);
    const [editedPhone, setEditedPhone] = useState(contact.phone);
    const [editedEmail, setEditedEmail] = useState(contact.email);

    const handleNameClick = () => {
      setIsEditing(true);
    };

    const handleNameChange = (e) => {
      setEditedName(e.target.value);
    };

    const handleNameBlur = () => {
      setIsEditing(false);
    };

    const handlePhoneChange = (e) => {
      setEditedPhone(e.target.value);
    };

    const handleEmailChange = (e) => {
      setEditedEmail(e.target.value);
    };

    const handleUpdate = async () => {
      const updatedContact = {
        index: index,
        name: editedName,
        phone: editedPhone,
        email: editedEmail,
      };

      if (!editedName || !editedPhone) {
        alert('Please fill in all fields');
      }
      else {
        try {
          const response = await fetch('/api/contacts/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact),
          });

          if (response.ok) {
            alert('Contact Updated!');
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

    const handleDelete = async () => {

      try {
        const response = await fetch('/api/contacts/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({index: index}),
        });

        if (response.ok) {
          alert('Contact Deleted!');
          window.location.href = '/';
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update contacts.');
        }
      } catch (error) {
        alert(error.message);
      }
    };


    return (
      <div className="w-full h-full max-w-xl bg-gray-100 bg-opacity-5 p-8 text-xl text-white rounded-md shadow-md flex flex-col">
        <div className="flex">
          <input
            id="name"
            className="text-3xl w-full bg-gray-100 bg-opacity-0 text-center truncate font-bold mb-32 focus:outline-none"
            value={editedName}
            onClick={handleNameClick}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            readOnly={!isEditing}
          />
          <FaTrash onClick={handleDelete} className="text-3xl text-red-600" />
        </div>
        <div className="mb-8">
          <p className="text-2xl font-semibold mb-2">Phone Number</p>
          <input
            id="phone"
            className="bg-gray-100 bg-opacity-0 border-b-white border-b font-regular focus:outline-none text-white w-full max-w-xl"
            value={editedPhone}
            onChange={handlePhoneChange}
          />
        </div>
        <div className="mb-8">
          <p className="text-2xl font-semibold mb-2">Email</p>
          <input
            id="email"
            className="bg-gray-100 bg-opacity-0 border-b-white border-b font-regular focus:outline-none text-white w-full max-w-xl"
            value={editedEmail}
            onChange={handleEmailChange}
          />
        </div>
        <div className="w-full flex justify-evenly gap-4 mt-auto text-2xl text-white">
          <button
            onClick={() => {
              setCurrentContact({});
              setCurrentContactIndex();
              setShowContact(false);
            }}
            className="bg-red-600 p-2 px-4 rounded-md"
          >
            Cancel
          </button>
          <button onClick={handleUpdate} className="bg-blue-600 p-2 px-4 rounded-md">
            Update
            </button>
        </div>
      </div>
    );
  };

  const handleDownload = () => {
    const fileUrl = '/vcf/contacts.vcf';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'contacts.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showContact) {
    return (
      <div className="absolute top-0 left-0 z-10 grid place-items-center w-screen h-[100dvh] bg-black p-8">
        <ContactCard contact={currentContact} index={currentContactIndex}/>
      </div>
    );
  }
  else {
    return (
      <div className="flex flex-col min-h-[100dvh]">
        <Head>
          <title>Nnisarg's Contacts</title>
        </Head>
        <nav className="bg-blue-600 p-4">
          <div className="flex justify-between px-4 text-white text-4xl font-bold">
            <h1>My Contacts</h1>
            <button onClick={handleDownload} className="text-2xl">
              <BiExport />
            </button>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex justify-center items-end gap-2 mb-8 mx-4">
            <button onClick={() => window.location.href = "/add"} className="fixed bottom-8 right-8 w-16 grid place-items-center aspect-square bg-blue-500 text-white text-2xl rounded-full p-3 drop-shadow-2xl">
              <FaPlus/>
            </button>
            <BiSearch className="text-3xl text-blue-600" />
            <input
              type="text"
              className="p-2 bg-black border-b-blue-600 border-b-2 focus:outline-none text-white w-full max-w-xl"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 place-items-center">
            {filteredContacts.map((contact, index) => (
              <div key={index} className="w-full max-w-xl bg-gray-800 px-4 rounded-md shadow-md flex justify-between items-center">
                <h2 onClick={() => window.location.href = "tel:" + contact.phone} className="text-lg font-bold truncate py-4 h-full w-full hover:cursor-pointer">{contact.name}</h2>
                <button onClick={() => {setCurrentContact(contact); setCurrentContactIndex(contact.id); setShowContact(true)}} className="text-xl text-white">
                  <BsThreeDotsVertical />
                </button>
              </div>
            ))}
          </div>
        </div>
        <footer className="bg-gray-900 py-4">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <p className="text-center text-white text-sm">
              &copy; {new Date().getFullYear()} <a href="https://nnisarg.in" className="text-blue-400">Nnisarg Gada</a> | All Rights Reserved
            </p>
          </div>
        </footer>
      </div>
    );
  }
};
export default ContactList;
