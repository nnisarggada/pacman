import fs from 'fs';
import path from 'path';

const updateContacts = (req, res) => {
  const { name, phone, email } = req.body;

  // Create the VCF content
  const vcfContent = `BEGIN:VCARD
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD\n`;

  // Set the file path
  const filePath = path.join(process.cwd(), 'public', 'vcf', 'contacts.vcf');

  try {
    // Read the existing contacts
    let existingContacts = fs.readFileSync(filePath, 'utf-8');

    // Append the new contact to the existing contacts
    const updatedContacts = existingContacts + vcfContent;

    // Sort contacts based on name
    const sortedContacts = sortContacts(updatedContacts);

    // Write the sorted contacts back to the file
    fs.writeFileSync(filePath, sortedContacts);

    res.status(200).json({ message: 'Contact added and contacts sorted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add contact and sort contacts.' });
  }
};

const sortContacts = (contacts) => {
  const lines = contacts.split('\n');

  const contactCards = [];
  let currentCard = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'BEGIN:VCARD') {
      currentCard = line + '\n';
    } else if (line === 'END:VCARD') {
      currentCard += line + '\n';
      contactCards.push(currentCard);
      currentCard = '';
    } else if (line) {
      currentCard += line + '\n';
    }
  }

  const sortedCards = contactCards.sort((a, b) => {
    const nameA = a.match(/FN:(.*)/)[1].toLowerCase();
    const nameB = b.match(/FN:(.*)/)[1].toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const sortedContacts = sortedCards.join('');

  return sortedContacts;
};

export default updateContacts;
