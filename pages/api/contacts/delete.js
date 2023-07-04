import fs from 'fs';
import path from 'path';

const deleteContact = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { index } = req.body;

  // Set the file path
  const filePath = path.join(process.cwd(), 'public', 'vcf', 'contacts.vcf');

  try {
    let existingContacts = fs.readFileSync(filePath, 'utf-8');

    let lines = existingContacts.split('\n');

    lines.splice(index, 5);
    
    const updatedContacts = lines.join('\n');

    fs.writeFileSync(filePath, updatedContacts);

    res.status(200).json({ message: 'Contact Deleted!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed!' });
  }
};

export default deleteContact;
