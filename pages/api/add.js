import fs from "fs";
import path from "path";
import secrets from "@/data/secrets";

const addContact = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secretHeader = req.headers["secret"];
  const secretKey = secrets.password;
  if (secretHeader !== secretKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, phone, email } = req.body;

  // Create the VCF content
  const vcfContent = `BEGIN:VCARD
  FN:${name}
  TEL:${phone}
  EMAIL:${email}
  END:VCARD\n`;

  // Set the file path to the new location in the 'data' folder
  const filePath = path.join(process.cwd(), "data", "contacts.vcf");

  try {
    // Read the existing contacts
    let existingContacts = fs.readFileSync(filePath, "utf-8");

    // Check if a contact with the same name exists
    if (contactExists(existingContacts, name)) {
      throw new Error("Contact with the same name already exists.");
    }

    // Append the new contact to the existing contacts
    const updatedContacts = existingContacts + vcfContent;

    // Sort contacts based on name
    const sortedContacts = sortContacts(updatedContacts);

    // Write the sorted contacts back to the file
    fs.writeFileSync(filePath, sortedContacts);

    res.status(200).json({ message: "Contact Added!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const contactExists = (contacts, name) => {
  const lines = contacts.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith("FN:") &&
      line.substring(3).toLowerCase() === name.toLowerCase()
    ) {
      return true;
    }
  }
  return false;
};

const sortContacts = (contacts) => {
  const lines = contacts.split("\n");

  const contactCards = [];
  let currentCard = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "BEGIN:VCARD") {
      currentCard = line + "\n";
    } else if (line === "END:VCARD") {
      currentCard += line + "\n";
      contactCards.push(currentCard);
      currentCard = "";
    } else if (line) {
      currentCard += line + "\n";
    }
  }

  const sortedCards = contactCards.sort((a, b) => {
    const nameA = a.match(/FN:(.*)/)[1].toLowerCase();
    const nameB = b.match(/FN:(.*)/)[1].toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const sortedContacts = sortedCards.join("");

  return sortedContacts;
};

export default addContact;
