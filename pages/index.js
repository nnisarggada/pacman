import React, { useEffect, useState } from 'react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

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

  return (
    <div>
      <h1>Contact List</h1>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            Name: {contact.name}, Phone: {contact.phone}, Email: {contact.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
